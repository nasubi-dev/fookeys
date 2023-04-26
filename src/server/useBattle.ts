import { db } from "./firebase";
import { collection, doc, getDoc, updateDoc, getDocs, onSnapshot } from "firebase/firestore";
import { getPlayerData } from "./usePlayerID";
import type { GameData, Card, Hand } from "@/types";

//Collectionの参照
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");
const deckRef = collection(db, "deck");

//Game情報を取得
async function getGameData(GameID: string): Promise<GameData> {
  const docSnap = await getDoc(doc(gamesRef, GameID));
  if (docSnap.exists()) {
    console.log("GameDocument data:", docSnap.data());

    return docSnap.data() as GameData;
  } else {
    console.log("No such GameDocument!");
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
export async function setHand(playerID: string): Promise<Hand> {
  const player = await getPlayerData(playerID);
  for (let i = 0; i < 6; i++) {
    const card = await drawCard();
    player.hand.push(card);
    updateDoc(doc(playersRef, playerID), { hand: player.hand });
  }
  return player.hand;
}

//missionを3つセットする

//!すべてのフェーズ管理
export async function useBattle(gameID: string): Promise<GameData> {
  const gameData = await getGameData(gameID);
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
