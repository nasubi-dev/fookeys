import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { PlayerData, Character, Gift } from "@/types";

//Collectionの参照
const playersRef = collection(db, "players");
const charactersRef = collection(db, "characters");
const giftsRef = collection(db, "gifts");

//player登録
async function registerPlayer(): Promise<string> {
  const newPlayer: PlayerData = {
    id: "",
    sign: 0,
    name: "No name",
    idEnemy: "",
    idGame: "",
    match: "nothing",
    character: 0,
    gift: 0,
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
    console.error("Error adding document: ", error);
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

//characterの取得
async function getCharacterData(): Promise<Character[]> {
  return (await getDocs(charactersRef)).docs.map((doc) => doc.data()) as Character[];
}

//giftの取得
async function getGiftData(): Promise<Gift[]> {
  return (await getDocs(giftsRef)).docs.map((doc) => doc.data()) as Gift[];
}

export { registerPlayer, deletePlayer, updatePlayerName, getCharacterData, getGiftData };
