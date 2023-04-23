import { reactive, ref } from "vue";
import { collection, doc, getDoc, updateDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { GameData, Card } from "@/types";

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
async function drawCard(): Promise<Card> {
  const deck = (await getDocs(deckRef)).docs.map((doc) => doc.data());
  const selectCard = deck[Math.floor(Math.random() * deck.length)];
  return selectCard as Card;
}

//cardをHandに6枚セットする
async function setHand(gameData: GameData): Promise<void> {
  for (let i = 0; i < 6; i++) {
    gameData.players[0].hand.push(await drawCard());
    gameData.players[1].hand.push(await drawCard());
  }
  console.log("player1 hand: ", gameData.players[0].hand);
  console.log("player2 hand: ", gameData.players[1].hand);
}
//!すべてのフェーズ管理
export async function useBattle(gameID: string): Promise<GameData> {
  const gameData = await getGameData(gameID);
  console.log("turn: ", gameData.turn);
  // const unsubscribe = onSnapshot(doc(gamesRef, gameID), (doc) => {
  //   const gameDataSnap = doc.data();
  //   if (!gameDataSnap) return;
  //   gameDataSnap.players[0].hand.forEach((card: Card) => {
  //     console.log(card);
  //   });
  // });
  setHand(gameData);
  return gameData as GameData;
}
//!export5日まとめる
