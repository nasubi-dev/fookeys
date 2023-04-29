import { db } from "./firebase";
import { collection, doc, getDoc, updateDoc, getDocs, onSnapshot } from "firebase/firestore";
import type { GameData, Card, Mission } from "@/types";
import { playerStore, gameStore } from "@/main";

//Collectionの参照
const missionsRef = collection(db, "missions");
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
export async function setHand(): Promise<void> {
  for (let i = 0; i < 6; i++) {
    const card = await drawCard();
    playerStore.hand.push(card as Card);
    //updateDocはonSnapShotを使うようになったら消す
    updateDoc(doc(playersRef, playerStore.id), { hand: playerStore.hand });
  }
}

//missionを3つセットする
export async function setMissions(): Promise<void> {
  const missions = (await getDocs(missionsRef)).docs.map((doc) => doc.data());
  for (let i = 0; i < 3; i++) {
    const selectMission = missions[Math.floor(Math.random() * missions.length)];
    gameStore.missions.push(selectMission as Mission);
    //updateDocはonSnapShotを使うようになったら消す 特にmissionは共有の情報なので
    updateDoc(doc(gamesRef, playerStore.idGame), { missions: gameStore.missions });
  }
}

//!すべてのフェーズ管理
export async function useBattle(): Promise<void> {
  gameStore.$state = await getGameData(playerStore.idGame);
  //TODO onSnapShotをここに書く
  // const unsubscribe = onSnapshot(doc(gamesRef, gameID), (doc) => {
  //   const gameDataSnap = doc.data();
  //   if (!gameDataSnap) return;
  //   gameDataSnap.players[0].hand.forEach((card: Card) => {
  //     console.log(card);
  //   });
  // });
}
//!export5日まとめる
