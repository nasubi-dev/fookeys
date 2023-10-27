import { toRefs } from "vue";
import { e, s, i } from "@/log";
import { playerStore, enemyPlayerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, doc, addDoc, deleteDoc, onSnapshot, getDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import type { PlayerData } from "@/types";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());

//player登録
async function registerPlayer(): Promise<void> {
  const { id, player, log } = storeToRefs(playerStore);
  try {
    id.value = (await addDoc(playersRef, player.value)).id;
    console.log(i, "Create Your ID: ", id.value);
    log.value = "Create Your ID: " + id.value;
  } catch (error) {
    console.error(e, "Error adding Your ID: ", error);
  }
}
//player削除
async function deletePlayer(): Promise<void> {
  const { id, log } = storeToRefs(playerStore);
  try {
    if (!id.value) return;
    await deleteDoc(doc(playersRef, id.value));
    console.log(i, "Player deleted: ", id.value);
    log.value = "Player deleted: " + id.value;
  } catch (error) {
    console.error(e, "Error deleting player: ", error);
  }
}
//enemyPlayer情報常時取得
async function getEnemyPlayer(): Promise<void> {
  // console.log(i, "getEnemyPlayerを実行しました");
  const { player } = storeToRefs(playerStore);
  const { idEnemy } = toRefs(player.value);
  const { enemyPlayer } = storeToRefs(enemyPlayerStore);

  if (!idEnemy.value) return;
  const data = (await getDoc(doc(playersRef, idEnemy.value))).data() as PlayerData;
  if (!data) return;
  enemyPlayer.value = data;
  console.log(i, "getEnemyPlayerが完了しました");
  console.log(i, enemyPlayer.value);
}

export { registerPlayer, deletePlayer, getEnemyPlayer };
