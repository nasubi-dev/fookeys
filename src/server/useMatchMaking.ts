import { router } from "@/router";
import { collection, doc, addDoc, getDoc, updateDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { GameData, MatchStatus, PlayerData } from "@/types";

//Collectionの参照
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");

//player情報の取得
async function getPlayerData(playerID: string): Promise<{ id: string; data: PlayerData }> {
  const docSnap = await getDoc(doc(playersRef, playerID));
  if (docSnap.exists()) {
    return { id: docSnap.id, data: docSnap.data() as PlayerData };
  } else {
    console.log("No such document!");
    return { id: "", data: docSnap.data() as PlayerData }; //!修正します5日
  }
}

//マッチング待機中のplayerを検索する
async function findWaitingPlayer(playerID: string): Promise<string | undefined> {
  const players = (await getDocs(query(playersRef, where("match", "==", "waiting")))).docs.map((doc) => doc.id);
  console.log("Found players: ", players);
  if (players.length < 2) {
    console.log("Not enough players to start a game");
    return undefined;
  }
  // 自分を除外する
  players.splice(players.indexOf(playerID), 1);
  // ランダムに選択する
  const player = players[Math.floor(Math.random() * players.length)];
  console.log("Found player: ", player);
  return player;
}

//playerのフィールド名を更新する
async function updatePlayerField(
  playerID: string,
  playerUpdateField: keyof PlayerData,
  field: string | MatchStatus
): Promise<void> {
  try {
    await updateDoc(doc(playersRef, playerID), { [playerUpdateField]: field });
    console.log(playerUpdateField, "updated: ", field, " for player: ", playerID);
  } catch (error) {
    console.error("Error updating match status: ", error);
  }
}

//playerのフィールド名を複数更新する
async function updatePlayerFields(
  playerID: string,
  updates: Array<{ field: keyof PlayerData; value: string | MatchStatus }>
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
    if (data.match === "matching") {
      console.log("matchが", data.match, "に変更されました");
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
async function startMatchmaking(ownPlayerID: string): Promise<string> {
  // マッチング待機中のユーザーを検索する
  await updatePlayerField(ownPlayerID, "match", "waiting");
  const waitingPlayerID = await findWaitingPlayer(ownPlayerID);

  // マッチング待機中のユーザーがいない場合は、マッチング待機中にする
  if (!waitingPlayerID) {
    console.log("マッチング待機中...");
    await watchMatchField(ownPlayerID);
    return "";
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
    console.log("rooting complete");

    return idGame;
  }
}

//gameを作成する
async function addGame(player1: string, player2: string): Promise<string> {
  const player1Data = (await getPlayerData(player1)).data;
  const player2Data = (await getPlayerData(player2)).data;
  const newGame: GameData = {
    turn: 1,
    players: [
      {
        name: player1Data.name,
        character: player1Data.character,
        gift: player1Data.gift,
        check: false,
        hand: [],
        board: [],
        status: { hp: 600, hungry: 0, contribution: 0, priority: 0 },
      },
      {
        name: player2Data.name,
        character: player2Data.character,
        gift: player2Data.gift,
        check: false,
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
  return "";
}

//gameを削除する
async function deleteGame(gameID: string): Promise<void> {}

export { getPlayerData, startMatchmaking };
