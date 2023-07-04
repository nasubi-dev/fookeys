import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, doc, addDoc, deleteDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import type { PlayerData } from "@/types";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());

//player登録
async function registerPlayer(): Promise<void> {
  const { id, player } = storeToRefs(playerStore);
  try {
    id.value = (await addDoc(playersRef, player.value)).id;
    console.log(i, "Create Your ID: ", id.value);
  } catch (error) {
    console.error(e, "Error adding Your ID: ", error);
  }
}
//player削除
async function deletePlayer(): Promise<void> {
  const { id } = storeToRefs(playerStore);
  try {
    if (!id.value) return;
    await deleteDoc(doc(playersRef, id.value));
    console.log(i, "Player deleted: ", id.value);
  } catch (error) {
    console.error(e, "Error deleting player: ", error);
  }
}

export { registerPlayer, deletePlayer };
