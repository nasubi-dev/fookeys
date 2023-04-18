import { router } from "@/router";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Game, MatchStatus, Player } from "@/types";

//Collectionの参照
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");

//user登録
async function registerPlayer(): Promise<string> {
  const newPlayer: Player = {
    id: "",
    idEnemy: "",
    idGame: "",
    name: "No name",
    match: "nothing",
    character: 0,
    gift: 0,
  };
  try {
    const docRef = await addDoc(playersRef, newPlayer);
    console.log("Create Your ID: ", docRef.id);
    const playerID = docRef.id;
    return playerID;
  } catch (error) {
    console.error("Error adding document: ", error);
    return "";
  }
}

//user削除
async function deletePlayer(playerID: string): Promise<void> {
  try {
    await deleteDoc(doc(playersRef, playerID));
    console.log("Player deleted: ", playerID);
  } catch (error) {
    console.error("Error deleting player: ", error);
  }
}

//user情報の取得
async function getPlayer(playerID: string): Promise<{ id: string; data: Player }> {
  const docSnap = await getDoc(doc(playersRef, playerID));
  if (docSnap.exists()) {
    return { id: docSnap.id, data: docSnap.data() as Player };
  } else {
    console.log("No such document!");
    return { id: "", data: docSnap.data() as Player }; //!修正します5日
  }
}

//nameの変更
async function updatePlayerName(playerID: string, newName: string): Promise<string> {
  try {
    await updateDoc(doc(playersRef, playerID), { name: newName });
    console.log("Name updated for player: ", playerID);
    return newName;
  } catch (error) {
    console.error("Error updating name: ", error);
    return "";
  }
}

//マッチング待機中のuserを検索する
async function findWaitingPlayer(playerID: string): Promise<string | undefined> {
  const players = (await getDocs(query(playersRef, where("match", "==", "waiting")))).docs.map(
    (doc) => doc.id
  );
  console.log("Found players: ", players);
  if (players.length < 2) {
    console.log("Not enough players to start a game");
    return undefined;
  }

  // 自分を除外する
  players.splice(players.indexOf(playerID), 1, "waiting");

  // ランダムに選択する
  const player = players[Math.floor(Math.random() * players.length)];
  console.log("Found player: ", player);
  return player;
}

//userのフィールド名を更新する
async function updatePlayerField(
  playerID: string,
  playerUpdateField: keyof Player,
  field: string | MatchStatus | undefined
): Promise<void> {
  try {
    await updateDoc(doc(playersRef, playerID), { [playerUpdateField]: field });
    console.log(playerUpdateField, "updated: ", field, " for player: ", playerID);
  } catch (error) {
    console.error("Error updating match status: ", error);
  }
}

//userのフィールド名を複数更新する
async function updatePlayerFields(
  playerID: string,
  updates: Array<{ field: keyof Player; value: string | MatchStatus | undefined }>
): Promise<void> {
  updates.forEach((update) => {
    updatePlayerField(playerID, update.field, update.value);
  });
}

//matchの値が-1に変更されたら検知して、gameを開始する
async function watchMatchField(ownPlayerID: string): Promise<void> {
  const unsubscribe = onSnapshot(doc(playersRef, ownPlayerID), (doc) => {
    const data = doc.data();
    if (!data) return;
    // 監視対象のフィールドが指定した値になった場合に実行される処理
    if (data.match === -1) {
      console.log("matchが", -1, "に変更されました");
      //waitingPlayerIDを入手する
      const waitingPlayerID = data.idEnemy;
      console.log("waitingPlayerID: ", waitingPlayerID);
      //gameIDを入手する
      const idGame = data.idGame;
      console.log("idGame: ", idGame);
      // 監視を解除
      unsubscribe();
      //画面遷移
      console.log("マッチ成功!相手ID:", waitingPlayerID, "ゲームID:", idGame);
      router.push({ name: "battle", params: { idGame: idGame } });
    }
  });
}

//マッチングを開始する
async function startMatchmaking(ownPlayerID: string): Promise<string | undefined> {
  // マッチング待機中のユーザーを検索する
  await updatePlayerField(ownPlayerID, "match", "waiting");
  const waitingPlayerID = await findWaitingPlayer(ownPlayerID);

  // マッチング待機中のユーザーがいない場合は、マッチング待機中にする
  if (!waitingPlayerID) {
    console.log("マッチング待機中...");
    await watchMatchField(ownPlayerID);
    return undefined;
  } else {
    const idGame = await addGame(ownPlayerID, waitingPlayerID);
    //プレイヤーの情報を更新する
    await Promise.all([
      updatePlayerFields(waitingPlayerID, [
        { field: "idEnemy", value: ownPlayerID },
        { field: "idGame", value: idGame },
        { field: "match", value: "matching" },
      ]),
      updatePlayerFields(ownPlayerID, [
        { field: "idEnemy", value: waitingPlayerID },
        { field: "idGame", value: idGame },
        { field: "match", value: "matching" },
      ]),
    ]);
    //画面遷移
    console.log("マッチ成功!相手ID:", waitingPlayerID, "ゲームID:", idGame);
    router.push({ name: "battle", params: { idGame: idGame } });
    return idGame;
  }
}

//gameを作成する
async function addGame(player1: string, player2: string): Promise<string | undefined> {
  const player1Data = await getPlayer(player1).then((player) => player.data);
  const player2Data = await getPlayer(player2).then((player) => player.data);
  const newGame: Game = {
    turn: 1,
    players: [
      {
        id: player1,
        idEnemy: player2,
        idGame: player1Data.idGame,
        name: player1Data.name,
        match: player1Data.match,
        character: player1Data.character,
        gift: player1Data.gift,
        hand: [],
        board: [],
        status: { hp: 600, hungry: 0, contribution: 0, priority: 0 },
      },
      {
        id: player2,
        idEnemy: player1,
        idGame: player2Data.idGame,
        name: player2Data.name,
        match: player2Data.match,
        character: player2Data.character,
        gift: player2Data.gift,
        hand: [],
        board: [],
        status: { hp: 600, hungry: 0, contribution: 0, priority: 0 },
      },
    ],
  };

  try {
    const docRef = await addDoc(gamesRef, newGame);
    console.log("games Document ID: ", docRef.id);
    if (docRef.id) {
      return docRef.id;
    } else {
      console.log("No such games document!");
    }
  } catch (error) {
    console.error("Error adding games document: ", error);
  }
  return undefined;
}

//gameを削除する
async function deleteGame(gameID: string): Promise<void> {}

export { registerPlayer, deletePlayer, updatePlayerName, startMatchmaking };
