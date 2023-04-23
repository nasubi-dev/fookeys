import { reactive, ref } from "vue";
import { collection, doc, getDoc, updateDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { GameData, Card, Hand } from "@/types";

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
export async function setHand(gameID: string, playerID: number): Promise<Hand> {
  const gameData = await getGameData(gameID);
  for (let i = 0; i < 6; i++) {
    const card = await drawCard();
    gameData.players[playerID].hand.push(card);
    updateDoc(doc(gamesRef, gameID), { players: gameData.players });
  }
  console.log("player", playerID, " hand: ", gameData.players[playerID].hand);
  return gameData.players[playerID].hand;
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
  return gameData as GameData;
}
//!export5日まとめる
