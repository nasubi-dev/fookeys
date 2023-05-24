import { db } from "./firebase";
import { collection, doc, addDoc, updateDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { getPlayerData } from "./usePlayerID";
import type { MatchStatus, PlayerData } from "@/types";
import { router } from "@/router";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import { toRefs } from "vue";
import { e, s, i } from "@/log";

//Collectionの参照
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");

//マッチング待機中のplayerを検索する
async function findWaitingPlayer(): Promise<void> {
  const { id, data } = storeToRefs(playerStore);
  const { idEnemy } = toRefs(data.value);
  const waitingPlayers = (await getDocs(query(playersRef, where("match", "==", "waiting")))).docs.map((doc) => doc.id);
  console.log(i, "Found players: ", waitingPlayers);
  if (waitingPlayers.length < 2) {
    console.log(i, "Not enough players to start a game");
  }
  // 自分を除外する
  waitingPlayers.splice(waitingPlayers.indexOf(id.value), 1);
  // ランダムに選択する
  idEnemy.value = waitingPlayers[Math.floor(Math.random() * waitingPlayers.length)];
  console.log(i, "Found player: ", idEnemy.value);
}

//playerのフィールド名を更新する
async function updatePlayerField(playerID: string, field: keyof PlayerData, value: string | MatchStatus | number): Promise<void> {
  try {
    await updateDoc(doc(playersRef, playerID), { [field]: value });
    console.log(i, field, "updated: ", value, " for player: ", playerID);
  } catch (error) {
    console.error(e, "Error updating match status: ", error);
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
  const { id, data } = storeToRefs(playerStore);
  const { idEnemy, idGame } = toRefs(data.value);
  const unsubscribe = onSnapshot(doc(playersRef, id.value), (doc) => {
    const data = doc.data();
    if (!data) return;
    // 監視対象のフィールドが指定した値になった場合に実行される処理
    if (data.match === "matching") {
      console.log(i, "matchが", data.match, "に変更されました");
      idEnemy.value = data.idEnemy;
      idGame.value = data.idGame;
      // 監視を解除
      unsubscribe();
      //画面遷移
      console.log(s, "マッチ成功!相手ID:", playerStore.data.idEnemy, "ゲームID:", idGame.value);
      router.push({ name: "battle", params: { idGame: idGame.value } });
    }
  });
}

//マッチングを開始する
async function startMatchmaking(): Promise<void> {
  const { id, data } = storeToRefs(playerStore);
  const { idEnemy, idGame } = toRefs(data.value);
  // マッチング待機中のユーザーを検索する
  await updatePlayerField(id.value, "match", "waiting");
  await findWaitingPlayer();

  // マッチング待機中のユーザーがいない場合は、マッチング待機中にする
  if (!idEnemy.value) {
    console.log(i, "マッチング待機中...");
    await watchMatchField();
    idGame.value = "";
  } else {
    idGame.value = await addGame();
    //プレイヤーの情報を更新する
    //実はここ結構気に入ってるんよね
    await Promise.all([
      updatePlayerFields(idEnemy.value, [
        { field: "idEnemy", value: id.value },
        { field: "idGame", value: idGame.value },
        { field: "match", value: "matching" },
      ]),
      updatePlayerFields(id.value, [
        { field: "idEnemy", value: idEnemy.value },
        { field: "idGame", value: idGame.value },
        { field: "match", value: "matching" },
      ]),
    ]);
    //画面遷移
    console.log(i, "マッチ成功!相手ID:", idEnemy.value, "ゲームID:", idGame.value);
    router.push({ name: "battle", params: { idGame: idGame.value } });
    console.log(s, "rooting complete");
  }
}

//gameを作成する
async function addGame(): Promise<string> {
  const { game } = storeToRefs(gameStore);
  const { id, data } = storeToRefs(playerStore);
  const { idEnemy } = toRefs(data.value);
  try {
    const docId = (await addDoc(gamesRef, game.value)).id;
    console.log(s, "games Document ID: ", docId);
    await updateDoc(doc(gamesRef, docId), { players: [id.value, idEnemy.value] });
    return docId;
  } catch (error) {
    console.error(e, "Error adding games document: ", error);
  }
  return "";
}

//gameを削除する
async function deleteGame(): Promise<void> {}

export { getPlayerData, updatePlayerField, startMatchmaking };
