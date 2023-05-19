import { db } from "./firebase";
import { collection, doc, addDoc, updateDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { getPlayerData } from "./usePlayerID";
import type { MatchStatus, PlayerData } from "@/types";
import { router } from "@/router";
import { playerStore, gameStore } from "@/main";

//Collectionの参照
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");

//マッチング待機中のplayerを検索する
async function findWaitingPlayer(): Promise<void> {
  const waitingPlayers = (await getDocs(query(playersRef, where("match", "==", "waiting")))).docs.map((doc) => doc.id);
  console.log("Found players: ", waitingPlayers);
  if (waitingPlayers.length < 2) {
    console.log("Not enough players to start a game");
  }
  // 自分を除外する
  waitingPlayers.splice(waitingPlayers.indexOf(playerStore.id), 1);
  // ランダムに選択する
  playerStore.idEnemy = waitingPlayers[Math.floor(Math.random() * waitingPlayers.length)];
  console.log("Found player: ", playerStore.idEnemy);
}

//playerのフィールド名を更新する
async function updatePlayerField(
  playerID: string,
  field: keyof PlayerData,
  value: string | MatchStatus | number
): Promise<void> {
  try {
    await updateDoc(doc(playersRef, playerID), { [field]: value });
    console.log(field, "updated: ", value, " for player: ", playerID);
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
async function watchMatchField(): Promise<void> {
  const unsubscribe = onSnapshot(doc(playersRef, playerStore.id), (doc) => {
    const data = doc.data();
    if (!data) return;
    // 監視対象のフィールドが指定した値になった場合に実行される処理
    if (data.match === "matching") {
      console.log("matchが", data.match, "に変更されました");
      playerStore.idEnemy = data.idEnemy;
      playerStore.idGame = data.idGame;
      // 監視を解除
      unsubscribe();
      //画面遷移
      console.log("マッチ成功!相手ID:", playerStore.idEnemy, "ゲームID:", playerStore.idGame);
      router.push({ name: "battle", params: { idGame: playerStore.idGame } });
    }
  });
}

//マッチングを開始する
async function startMatchmaking(): Promise<void> {
  // マッチング待機中のユーザーを検索する
  await updatePlayerField(playerStore.id, "match", "waiting");
  await findWaitingPlayer();

  // マッチング待機中のユーザーがいない場合は、マッチング待機中にする
  if (!playerStore.idEnemy) {
    console.log("マッチング待機中...");
    await watchMatchField();
    playerStore.idGame = "";
  } else {
    playerStore.idGame = await addGame();
    //プレイヤーの情報を更新する
    //実はここ結構気に入ってるんよね
    await Promise.all([
      updatePlayerFields(playerStore.idEnemy, [
        { field: "idEnemy", value: playerStore.id },
        { field: "idGame", value: playerStore.idGame },
        { field: "match", value: "matching" },
      ]),
      updatePlayerFields(playerStore.id, [
        { field: "idEnemy", value: playerStore.idEnemy },
        { field: "idGame", value: playerStore.idGame },
        { field: "match", value: "matching" },
      ]),
    ]);
    //画面遷移
    console.log("マッチ成功!相手ID:", playerStore.idEnemy, "ゲームID:", playerStore.idGame);
    router.push({ name: "battle", params: { idGame: playerStore.idGame } });
    console.log("rooting complete");
  }
}

//gameを作成する
async function addGame(): Promise<string> {
  try {
    const docId = (await addDoc(gamesRef, gameStore.newGame)).id;
    console.log("games Document ID: ", docId);
    await updateDoc(doc(gamesRef, docId), { players: [playerStore.id, playerStore.idEnemy] });
    return docId;
  } catch (error) {
    console.error("Error adding games document: ", error);
  }
  return "";
}

//gameを削除する
async function deleteGame(): Promise<void> { }

export { getPlayerData, updatePlayerField, startMatchmaking };
