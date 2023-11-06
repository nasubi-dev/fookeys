import { toRefs } from "vue";
import { e, s, i } from "@/log";
import { playerStore, enemyPlayerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, doc, addDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
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
//player情報初期化 残す情報はid,name,character,gifts
async function initPlayer(): Promise<void> {
  const { id, player } = storeToRefs(playerStore);
  let keepId = id.value;
  let keepName = player.value.name;
  let keepCharacter = player.value.character;
  let keepGifts = player.value.gifts;

  playerStore.$reset();
  enemyPlayerStore.$reset();
  gameStore.$reset();

  id.value = keepId;
  player.value.name = keepName;
  player.value.character = keepCharacter;
  player.value.gifts = keepGifts;
  await updateDoc(doc(playersRef, id.value), player.value);
  console.log(i, "Player initialized: ", id.value, player.value);
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
//enemyPlayer情報取得
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

export { registerPlayer, initPlayer, deletePlayer, getEnemyPlayer };
