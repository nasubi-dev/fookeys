import { collection, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { GameData } from "@/types";

//Collectionの参照
const gamesRef = collection(db, "games");
const deckRef = collection(db, "deck");

//Game情報を取得
async function getGameData(GameID: string): Promise<GameData> {
  const docSnap = await getDoc(doc(gamesRef, GameID));
  if (docSnap.exists()) {
    return docSnap.data() as GameData;
  } else {
    console.log("No such document!");
    return docSnap.data() as GameData; //!修正します5日
  }
}

//cardを一枚引く
async function drawCard() {
  const deck = (await getDocs(deckRef)).docs.map((doc) => doc.data());
  const selectCard = Math.floor(Math.random() * deck.length);
  return deck[selectCard];
}

//cardをセットする
async function setCard(gameID: string) {
  // for(6){
  //   const card = drawCard();
  //   await updateDoc(doc(gamesRef, gameID), { card: card });
  // }
}

//!すべてのフェーズ管理
export async function useBattle(gameID: string): Promise<GameData> {
  const gameData = await getGameData(gameID);
  console.log("turn: ", gameData.turn);
  setCard(gameID);
  return gameData as GameData;
}
//!export5日まとめる
