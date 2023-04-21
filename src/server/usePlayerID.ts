import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { PlayerData } from "@/types";

//Collectionの参照
const playersRef = collection(db, "players");

//player登録
async function registerPlayer(): Promise<string> {
  const newPlayer: PlayerData = {
    name: "No name",
    idEnemy: "",
    idGame: "",
    match: "nothing",
    character: 0,
    gift: 0,
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

export { registerPlayer, deletePlayer, updatePlayerName };
