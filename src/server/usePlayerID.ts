import { ref } from "vue";
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
} from "firebase/firestore";
import type { MatchStatus, Player } from "@/types";

import { db } from "./firebase";

//Collectionの参照
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");

const gameID = ref<string | null>(null);

//ユーザー登録
export async function registerPlayer(): Promise<string> {
  const newPlayer: Player = {
    id: "",
    enemyID: "",
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
): Promise<[string | null, string | null]> {
  // マッチング待機中のユーザーを検索する
  const waitingPlayerID = await findWaitingPlayer();

  // マッチング待機中のユーザーがいない場合は、マッチング待機中にする
  if (!waitingPlayerID) {
    await updatePlayerField(playerID, "match", 1);
    return [null, null];
  } else {
    // マッチング待機中のユーザーがいる場合は、対戦状態に更新する
    await Promise.all([
      updatePlayerField(playerID, "match", -1),
      updatePlayerField(waitingPlayerID, "match", -1),
      updatePlayerField(playerID, "enemyID", waitingPlayerID),
      updatePlayerField(waitingPlayerID, "enemyID", playerID),
    ]);
    console.log("Match started あなた:", playerID, "相手:", waitingPlayerID);
    gameID.value = await addGame(playerID, waitingPlayerID);
    return [waitingPlayerID, gameID.value];
  }
}

//マッチング待機中のユーザーを検索する
async function findWaitingPlayer(): Promise<string | null> {
  const querySnapshot = await getDocs(
    query(playersRef, where("match", "==", 1))
  );
  if (querySnapshot.empty) {
    return null;
  }
  const players = querySnapshot.docs.map((doc) => doc.id);
  return players[Math.floor(Math.random() * players.length)];
}

//ユーザーのフィールド名を更新する
async function updatePlayerField(
  playerID: string,
  playerUpdateField: string,
  field: string | MatchStatus
): Promise<void> {
  const playerRef = doc(playersRef, playerID);
  try {
    await updateDoc(playerRef, { [playerUpdateField]: field });
    console.log("Match status updated for player: ", playerID);
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
