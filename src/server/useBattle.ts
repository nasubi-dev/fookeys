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

import { db } from "./firebase";
import { usePlayerStore } from "@/store";

const playerStore = usePlayerStore();

//Collectionの参照
const gamesRef = collection(db, "games");
const playersRef = collection(db, "players");
const deckRef = collection(db, "deck");

//カードを一枚引く
export async function drawCard() {
	const deckSnap = await getDocs(deckRef);
	const deck = deckSnap.docs.map((doc) => doc.data());
	const random = Math.floor(Math.random() * deck.length);
	return deck[random];
}

//カードを選択して場に出す
export async function playCard(playerID:string,cardID:number) {
	
}