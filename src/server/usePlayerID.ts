import { onMounted } from "vue";
import { db } from "./firebase";
import { collection, doc, addDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import type { PlayerData, Character, Gift } from "@/types";
import { playerStore } from "@/main";
// import { storeToRefs } from "pinia";

//Collectionの参照
const playersRef = collection(db, "players");
const charactersRef = collection(db, "characters");
const giftsRef = collection(db, "gifts");

//piniaの参照
onMounted(async () => {
  //!どうにかしてplayerStoreのidを取得したい
  // const { id } = storeToRefs(playerStore);
});

//player登録
async function registerPlayer(): Promise<void> {
  try {
    playerStore.id = (await addDoc(playersRef, playerStore.newPlayer)).id;
    console.log("Create Your ID: ", playerStore.id);
  } catch (error) {
    console.error("Error adding Your ID: ", error);
  }
}

//player削除
async function deletePlayer(): Promise<void> {
  try {
    if (!playerStore.id) return;
    await deleteDoc(doc(playersRef, playerStore.id));
    console.log("Player deleted: ", playerStore.id);
  } catch (error) {
    console.error("Error deleting player: ", error);
  }
}

//player情報の取得
async function getPlayerData(playerID: string): Promise<PlayerData> {
  const docSnap = await getDoc(doc(playersRef, playerID));
  if (docSnap.exists()) {
    return docSnap.data() as PlayerData;
  } else {
    console.log("No such PlayerDocument!");
    return docSnap.data() as PlayerData; //!修正します5日
  }
}

//characterの取得
async function getCharacterData(): Promise<Character[]> {
  return (await getDocs(charactersRef)).docs.map((doc) => doc.data()) as Character[];
}

//giftの取得
async function getGiftData(): Promise<Gift[]> {
  return (await getDocs(giftsRef)).docs.map((doc) => doc.data()) as Gift[];
}

export { registerPlayer, deletePlayer, getPlayerData, getCharacterData, getGiftData };
