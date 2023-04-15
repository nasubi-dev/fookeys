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

//Collectionの参照
const gamesRef = collection(db, "games");
const playersRef = collection(db, "players");
const deckRef = collection(db, "deck");

//ターンを進める 増減値を引数に

//死亡判断

//勝敗判断 死亡判断から呼び出す

//

//カードを一枚引く
export async function drawCard() {
  const deckSnap = await getDocs(deckRef);
  const deck = deckSnap.docs.map((doc) => doc.data());
  const selectCard = Math.floor(Math.random() * deck.length);
  return deck[selectCard];
}

//ギフトを使用する

//カードを選択して場に出す
export async function playCard(playerID: string, cardID: number) {}

//ステータスを変更する 増減値を引数に

//
