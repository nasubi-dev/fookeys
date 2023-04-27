import { db } from "./firebase";
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import type { PlayerData, Character, Gift } from "@/types";

//Collectionの参照
const playersRef = collection(db, "players");
const charactersRef = collection(db, "characters");
const giftsRef = collection(db, "gifts");

//player登録
async function registerPlayer(): Promise<string> {
  const newPlayer: PlayerData = {
    sign: 0,
    name: "No name",
    idEnemy: "",
    idGame: "",
    match: "nothing",
    character: undefined,
    gift: [],
    check: false,
    hand: [],
    board: [],
    status: { hp: 0, hungry: 0, contribution: 0, priority: 0 },
  };
  try {
    const docRef = await addDoc(playersRef, newPlayer);
    console.log("Create Your ID: ", docRef.id);
    const playerID = docRef.id;
    return playerID;
  } catch (error) {
    console.error("Error adding Your ID: ", error);
    return "";
  }
}

//player削除
async function deletePlayer(playerID: string): Promise<void> {
  try {
    await deleteDoc(doc(playersRef, playerID));
    console.log("Player deleted: ", playerID);
  } catch (error) {
    console.error("Error deleting player: ", error);
  }
}

//nameの変更
async function updatePlayerName(playerID: string, newName: string): Promise<string> {
  try {
    await updateDoc(doc(playersRef, playerID), { name: newName });
    console.log("Name updated for player: ", playerID);
    return newName;
  } catch (error) {
    console.error("Error updating name: ", error);
    return "";
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

export { registerPlayer, deletePlayer, updatePlayerName, getPlayerData, getCharacterData, getGiftData };
