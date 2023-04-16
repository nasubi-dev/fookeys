import { ref } from "vue";
import { router } from '@/router';
import { useRouter } from 'vue-router'
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
import type { MatchStatus, Player } from "@/types";

import { db } from "./firebase";

//Collectionの参照
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");

const gameID = ref<string | null>(null);
const waitingPlayerID = ref<string | null>(null);
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
    hand: [],
    board: [],
    status: {
      atk: 0,
      def: 0,
      hp: 0,
      hungry: 0,
      matk: 0,
      mdef: 0,
    },
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
async function getPlayer(
  playerID: string
): Promise<{ id: string; data: Player }> {
  const docRef = doc(playersRef, playerID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, data: docSnap.data() as Player };
  } else {
    console.log("No such document!");
    return { id: "", data: docSnap.data() as Player }; //!修正します5日
  }
}

//名前の変更
export async function updatePlayerName(
  playerID: string,
  newName: string
): Promise<string> {
  const playerRef = doc(playersRef, playerID);
  try {
    await updateDoc(playerRef, { name: newName });
    console.log("Name updated for player: ", playerID);
    return newName;
  } catch (error) {
    console.error("Error updating name: ", error);
    return "";
  }
}

//マッチングを開始する
export async function startMatchmaking(
  playerID: string
): Promise<string|null> {
  // マッチング待機中のユーザーを検索する
  await updatePlayerField(playerID, "match", 1);
  waitingPlayerID.value = await findWaitingPlayer(playerID);

  // マッチング待機中のユーザーがいない場合は、マッチング待機中にする
  if (waitingPlayerID.value) {
    await Promise.all([
      updatePlayerField(waitingPlayerID.value, "enemyID", playerID),
      updatePlayerField(playerID, "enemyID", waitingPlayerID.value),
    ]);
    gameID.value = await addGame(playerID, waitingPlayerID.value);
    await Promise.all([
      updatePlayerField(waitingPlayerID.value, "gameID", gameID.value),
      updatePlayerField(playerID, "gameID", gameID.value),
    ]);
    await Promise.all([
      updatePlayerField(waitingPlayerID.value, "match", -1),
      updatePlayerField(playerID, "match", -1),
    ]);
    console.log('マッチ成功!相手ID:', waitingPlayerID.value, 'ゲームID:', gameID.value);
    const gameName=gameID.value;
    router.push({ name: 'battle', params: { gameID: gameName} });
  } else {
    console.log('マッチング待機中...');
    const unsubscribe = onSnapshot(doc(playersRef, playerID), (doc) => {
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
        console.log('マッチ成功!相手ID:', waitingPlayerID.value, 'ゲームID:', gameID.value);
        const gameName=gameID.value;
        router.push({ name: 'battle', params: { gameID: gameName} });
      }
    });
  }
  return gameID.value;
}

//マッチング待機中のユーザーを検索する
async function findWaitingPlayer(playerID: string): Promise<string | null> {
  const querySnapshot = await getDocs(
    query(playersRef, where("match", "==", 1))
  );
  const players = querySnapshot.docs.map((doc) => doc.id);
  console.log("Found players: ", players);
  if (players.length < 2) {
    console.log("Not enough players to start a game");
    return null;
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
  playerUpdateField: string,
  field: string | MatchStatus | null
): Promise<void> {
  const playerRef = doc(playersRef, playerID);
  try {
    await updateDoc(playerRef, { [playerUpdateField]: field });
    console.log(
      playerUpdateField,
      "updated: ",
      field,
      " for player: ",
      playerID
    );
  } catch (error) {
    console.error("Error updating match status: ", error);
  }
}

//ゲームを作成する
async function addGame(
  player1: string,
  player2: string
): Promise<string | null> {
  const player1Data = await getPlayer(player1).then((player) => player.data);
  const player2Data = await getPlayer(player2).then((player) => player.data);
  const newGame = {
    turn: 1,
    players: {
      player1: {
        id: player1,
        enemyId: player2,
        name: player1Data.name,
        match: -1,
        character: player1Data.character,
        gift: player1Data.gift,
        hand: [],
        board: [],
        status: { atk: 0, def: 0, hp: 400, hungry: 0, matk: 0, mdef: 0 },
      },
      player2: {
        id: player2,
        enemyId: player1,
        name: player2Data.name,
        match: -1,
        character: player2Data.character,
        gift: player2Data.gift,
        hand: [],
        board: [],
        status: { atk: 0, def: 0, hp: 400, hungry: 0, matk: 0, mdef: 0 },
      },
    },
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
  return null;
}

//ゲームを削除する