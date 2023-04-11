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
import { useUserStore } from '@/store';

const userStore = useUserStore();

//Collectionの参照
const gamesRef = collection(db, "games");
const usersRef = collection(db, "users");

//ユーザー情報の取得
const userInfo=async function getUser(userID: string){
  const docRef = doc(usersRef, userID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    return null;
  }
}

const newGame: Game = {
  turn: 1,
  players: {
    player1: {
      name: userStore.name,
      id: userStore.id,
      character: userStore.character,
      gift: userStore.gift,
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


// ゲームを作成する
export async function addGame() {

  try {
    const docRef = await addDoc(gamesRef, newGame);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
