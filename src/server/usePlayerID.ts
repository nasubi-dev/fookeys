import { ref } from "vue";
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
import type { Game, MatchStatus, Player } from "@/types";

import { db } from "./firebase";

//Collectionの参照
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");

const gameID = ref<string | undefined>(undefined);
const waitingPlayerID = ref<string | undefined>(undefined);

//ユーザー登録
export async function registerPlayer(): Promise<string> {
  const newPlayer: Player = {
    id: "",
    enemyID: "",
    gameID: "",
    name: "No name",
    match: 0,
    character: 0,
    gift: 0,
  };
  try {
    const docRef = await addDoc(playersRef, newPlayer);
    console.log("Create Your ID: ", docRef.id);
    const playerId = docRef.id;
    return playerId;
  } catch (error) {
    console.error("Error adding document: ", error);
    return "";
  }
}

//ユーザー削除
export async function deletePlayer(playerID: string): Promise<void> {
  try {
    await deleteDoc(doc(playersRef, playerID));
    console.log("Player deleted: ", playerID);
  } catch (error) {
    console.error("Error deleting player: ", error);
  }
}

//ユーザー情報の取得
async function getPlayer(playerID: string): Promise<{ id: string; data: Player }> {
  const docSnap = await getDoc(doc(playersRef, playerID));
  if (docSnap.exists()) {
    return { id: docSnap.id, data: docSnap.data() as Player };
  } else {
    console.log("No such document!");
    return { id: "", data: docSnap.data() as Player }; //!修正します5日
  }
}

//名前の変更
export async function updatePlayerName(playerID: string, newName: string): Promise<string> {
  try {
    await updateDoc(doc(playersRef, playerID), { name: newName });
    console.log("Name updated for player: ", playerID);
    return newName;
  } catch (error) {
    console.error("Error updating name: ", error);
    return "";
  }
}

//マッチング待機中のユーザーを検索する
async function findWaitingPlayer(playerID: string): Promise<string | undefined> {
  const players = (await getDocs(query(playersRef, where("match", "==", 1)))).docs.map((doc) => doc.id);
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

//ユーザーのフィールド名を更新する
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

//ユーザーのフィールド名を複数更新する
async function updatePlayerFields(
  playerID: string,
  updates: Array<{ field: keyof Player; value: string | MatchStatus | undefined }>
): Promise<void> {
  updates.forEach((update) => {
    updatePlayerField(playerID, update.field, update.value);
  });
}

//matchの値が-1に変更されたら検知して、ゲームを開始する
async function watchMatchField(ownPlayerID: string): Promise<void> {
  const unsubscribe = onSnapshot(doc(playersRef, ownPlayerID), (doc) => {
    const data = doc.data();
    if (!data) return;
    // 監視対象のフィールドが指定した値になった場合に実行される処理
    if (data.match === -1) {
      console.log("matchが", -1, "に変更されました");
      //waitingPlayerIDを入手する
      waitingPlayerID.value = data.enemyID;
      console.log("waitingPlayerID: ", waitingPlayerID.value);
      //gameIDを入手する
      gameID.value = data.gameID;
      console.log("gameID: ", gameID.value);
      // 監視を解除
      unsubscribe();
      //画面遷移
      console.log("マッチ成功!相手ID:", waitingPlayerID.value, "ゲームID:", gameID.value);
      router.push({ name: "battle", params: { gameID: gameID.value } });
    }
  });
}

//マッチングを開始する
export async function startMatchmaking(ownPlayerID: string): Promise<string | undefined> {
  // マッチング待機中のユーザーを検索する
  await updatePlayerField(ownPlayerID, "match", 1);
  waitingPlayerID.value = await findWaitingPlayer(ownPlayerID);

  // マッチング待機中のユーザーがいない場合は、マッチング待機中にする
  if (!waitingPlayerID.value) {
    console.log("マッチング待機中...");
    await watchMatchField(ownPlayerID);
    return undefined;
  } else {
    gameID.value = await addGame(ownPlayerID, waitingPlayerID.value);
    //プレイヤーの情報を更新する
    await Promise.all([
      updatePlayerFields(waitingPlayerID.value, [
        { field: "enemyID", value: ownPlayerID },
        { field: "gameID", value: gameID.value },
        { field: "match", value: -1 },
      ]),
      updatePlayerFields(ownPlayerID, [
        { field: "enemyID", value: waitingPlayerID.value },
        { field: "gameID", value: gameID.value },
        { field: "match", value: -1 },
      ]),
    ]);
    //画面遷移
    console.log("マッチ成功!相手ID:", waitingPlayerID.value, "ゲームID:", gameID.value);
    router.push({ name: "battle", params: { gameID: gameID.value } });
    return gameID.value;
  }
}

//ゲームを作成する
async function addGame(player1: string, player2: string): Promise<string | undefined> {
  const player1Data = await getPlayer(player1).then((player) => player.data);
  const player2Data = await getPlayer(player2).then((player) => player.data);
  const newGame: Game = {
    turn: 1,
    players: [
      {
        id: player1,
        enemyID: player2,
        gameID: player1Data.gameID,
        name: player1Data.name,
        match: player1Data.match,
        character: player1Data.character,
        gift: player1Data.gift,
        hand: [],
        board: [],
        status: { hp: 400, hungry: 0 },
      },
      {
        id: player2,
        enemyID: player1,
        gameID: player2Data.gameID,
        name: player2Data.name,
        match: player2Data.match,
        character: player2Data.character,
        gift: player2Data.gift,
        hand: [],
        board: [],
        status: { hp: 400, hungry: 0 },
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

//ゲームを削除する
