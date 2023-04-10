import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

//Collectionの参照
const gamesRef = collection(db, "games");

// ゲームを作成する
export async function addGame() {
  const newGame: Game = {
    turn: 1,
    players: {
      player1: {
        name: "player1",
        id: "player1_id",
        character: 0,
        gift: 0,
        hand: [],
        board: [],
        status: { atk: 0, def: 0, hp: 400, hungry: 0, matk: 0, mdef: 0 },
      },
      player2: {
        name: "player2",
        id: "player2_id",
        character: 0,
        gift: 0,
        hand: [],
        board: [],
        status: { atk: 0, def: 0, hp: 400, hungry: 0, matk: 0, mdef: 0 },
      },
    },
  };

  try {
    const docRef = await addDoc(gamesRef, newGame);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
