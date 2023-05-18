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
    const selectMission = allMissions[Math.floor(Math.random() * allMissions.length)] as Mission;
    gameStore.missions.push(selectMission);
    //選ばれたミッションはmissionsから削除する
    allMissions.splice(allMissions.indexOf(selectMission), 1);
  }
  //Firestoreにmissionsを保存する
  //updateDocはonSnapShotを使うようになったら消す 特にmissionは共有の情報なので
  updateDoc(doc(gamesRef, playerStore.idGame), { missions: gameStore.missions });
}

//checkの値の監視
export async function watchTurnEnd(): Promise<void> {
  playerStore.check = true;
  await updateDoc(doc(playersRef, playerStore.id), { check: playerStore.check });
  console.log("check: " + playerStore.check);
  const enemyCheck = (await getDoc(doc(playersRef, playerStore.idEnemy))).data()?.check as boolean;
  if (enemyCheck === true) {
    calcDamage();
  } else {
    const unsubscribe = onSnapshot(doc(playersRef, playerStore.idEnemy), (doc) => {
      const data = doc.data();
      if (!data) return;
      if (data.check == true) {
        calcDamage();
        //監視を解除する
        unsubscribe();
        console.log("監視を解除しました");
      }
    });
  }
}
//Priorityの比較
export async function comparePriority(order: number): Promise<number> {
  console.log("実行: comparePriorityを実行しました");
  const enemyPriority = (await getDoc(doc(playersRef, playerStore.idEnemy))).data()?.status.priority as number;
  if (!enemyPriority) console.log("Error: enemyPriorityが取得できませんでした");
  //priorityが大きい方が優先
  if (playerStore.status.priority > enemyPriority) {
    return playerStore.sign === 0 ? 0 : 1;
  } else if (playerStore.status.priority < enemyPriority) {
    return playerStore.sign === 0 ? 1 : 0;
  }
  return order;
}
//hungryの比較
export async function compareHungry(order: number): Promise<number> {
  console.log("実行: compareHungryを実行しました");
  const enemyHungry = (await getDoc(doc(playersRef, playerStore.idEnemy))).data()?.status.hungry as number;
  if (!enemyHungry) console.log("Error: enemyHungryが取得できませんでした");
  //hungryが小さい方が優先
  if (playerStore.status.hungry > enemyHungry) {
    return playerStore.sign === 0 ? 1 : 0;
  } else if (playerStore.status.hungry < enemyHungry) {
    return playerStore.sign === 0 ? 0 : 1;
  }
  return order;
}
//処理の順番を決める
export async function decideProcessOrder(): Promise<void> {
  console.log("実行: decideProcessOrderを実行しました");
  //順番はPriorityの値を優先する
  let order = 0;
  //!これ間違えてるわ ステータスじゃなくてカードのHungryを比較する
  order = await compareHungry(order);
  order = await comparePriority(order);
  console.log("order: " + order);
}
//ダメージを計算する
export async function calcDamage(): Promise<void> {
  console.log("実行: calcDamageを実行しました");
  decideProcessOrder();
}
//ダメージを計算する
//ダメージをFirestoreに保存する
//その値が正しいか確認する

//!すべてのターン管理(最終的な形は未定)
export async function useBattle(): Promise<void> {
  gameStore.$state = await getGameData(playerStore.idGame);
}
//!export5日まとめる
