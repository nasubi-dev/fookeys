import { db } from "./firebase";
import { collection, doc, getDoc, updateDoc, getDocs, onSnapshot } from "firebase/firestore";
import type { GameData, Card, Mission, Result } from "@/types";
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
    updateDoc(doc(playersRef, playerStore.id), { hand: playerStore.hand });
  }
}

//missionを3つセットする
export async function setMissions(): Promise<void> {
  if (playerStore.sign == 0) {
    //!onSnapshotを覚えたい
    const unsubscribe = onSnapshot(doc(gamesRef, playerStore.idGame), (doc) => {
      gameStore.missions = doc.data()?.missions;
    });
    return;
  }
  const allMissions = (await getDocs(missionsRef)).docs.map((doc) => doc.data());
  for (let i = 0; i < 3; i++) {
    const selectMission = allMissions[Math.floor(Math.random() * allMissions.length)];
    gameStore.missions.push(selectMission as Mission);
    //選ばれたミッションはmissionsから削除する
    allMissions.splice(allMissions.indexOf(selectMission), 1);
  }
  //Firestoreにmissionsを保存する
  //updateDocはonSnapShotを使うようになったら消す 特にmissionは共有の情報なので
  updateDoc(doc(gamesRef, playerStore.idGame), { missions: gameStore.missions });
}
//
const calcDamage = (result: Result): void => {
  //自分のatkと相手のdefを比較してダメージを計算する
};

//cardのダメージ計算
export async function cardCalc(): Promise<void> {
  //FirestoreにCardの情報を保存する
  updateDoc(doc(playersRef, playerStore.id), { field: playerStore.field });
  //自分と相手がFieldに出したカードを取得する
  const myField = (await getDoc(doc(playersRef, playerStore.id))).data()?.field;
  myField.forEach((card: Card) => {
    //自分がFieldに出したカードの値を計算する(atk,def,tech) 今はとりあえず特殊効果なし
    playerStore.sumFieldValue(card);
    console.log(playerStore.result);
  });
  const test = updateDoc(doc(gamesRef, playerStore.idGame), { result: playerStore.result });
  //両プレイヤーの処理が終わったら次の処理に移る
  test.then(async () => {
    //相手のResultを取得する
    const enemyResult = (await getDoc(doc(gamesRef, playerStore.idGame))).data()?.result as Result;
    //値を比較してダメージを計算する
    calcDamage(enemyResult);
  });

  //ダメージをFirestoreに保存する
  //その値が正しいか確認する
}

//!すべてのターン管理(最終的な形は未定)
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
