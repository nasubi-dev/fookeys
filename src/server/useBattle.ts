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

//checkの値の監視
export async function watchCheckField(): Promise<void> {
  playerStore.check = true;
  await updateDoc(doc(playersRef, playerStore.id), { check: playerStore.check });
  console.log("check: " + playerStore.check);
  const enemyCheck = (await getDoc(doc(playersRef, playerStore.idEnemy))).data()?.check;
  if (enemyCheck === true) {
    battleCalc();
  } else {
    const unsubscribe = onSnapshot(doc(playersRef, playerStore.idEnemy), (doc) => {
      const data = doc.data();
      if (!data) return;
      if (data.check == true) {
        battleCalc();
        //監視を解除する
        unsubscribe();
        console.log("監視を解除しました");
      }
    });
  }
}

//battleの計算
export async function battleCalc(): Promise<void> {
  console.log("battleCalcを実行しました");
}

//cardをランダムに一枚引く
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

//指定のcardを一枚引く

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

//fieldのカードを取得する
export async function getFieldCards(): Promise<void> {
  updateDoc(doc(playersRef, playerStore.id), { field: playerStore.field });
  return;
}

//cardのダメージ計算
//ダメージをFirestoreに保存する
//その値が正しいか確認する

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
