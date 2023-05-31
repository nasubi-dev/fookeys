import { db } from "./firebase";
import { collection, doc, addDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { e, s, i } from "@/log";
import { converter } from "@/server/converter";
import type { PlayerData, Character, Gift } from "@/types";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const charactersRef = collection(db, "characters").withConverter(converter<Character>());
const giftsRef = collection(db, "gifts").withConverter(converter<Gift>());

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

//characterの取得
async function getCharacterData(): Promise<Character[]> {
  return (await getDocs(charactersRef)).docs.map((doc) => doc.data());
}

//giftの取得
async function getGiftData(): Promise<Gift[]> {
  return (await getDocs(giftsRef)).docs.map((doc) => doc.data());
}

export { registerPlayer, deletePlayer, getCharacterData, getGiftData };
