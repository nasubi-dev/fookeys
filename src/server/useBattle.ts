import { db } from "./firebase";
import { collection, doc, getDoc, updateDoc, getDocs, onSnapshot, arrayUnion, increment } from "firebase/firestore";
import type { GameData, Card, Mission } from "@/types";
import { playerStore, gameStore } from "@/main";
import { e, s, i } from "@/log";
//Collectionの参照
const missionsRef = collection(db, "missions");
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");
const deckRef = collection(db, "deck");

//Game情報を取得
async function getGameData(GameID: string): Promise<GameData> {
  const docSnap = await getDoc(doc(gamesRef, GameID));
  if (docSnap.exists()) {
    return docSnap.data() as GameData;
  } else {
    console.log(e, "No such GameDocument!");
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
    //Firestoreにmissionsを保存する
    //arrayUnionを使うと、配列に要素を追加できる(arrayRemoveで削除もできる)
    //TODO: 一つづつ追加するのではなく、一度に追加するか悩み中
    await updateDoc(doc(gamesRef, playerStore.idGame), { missions: arrayUnion(selectMission) });
  }
}
//checkの値の監視
export async function watchTurnEnd(): Promise<void> {
  playerStore.check = true;
  await updateDoc(doc(playersRef, playerStore.id), { check: playerStore.check });
  console.log(i, "check: " + playerStore.check);
  const enemyCheck = (await getDoc(doc(playersRef, playerStore.idEnemy))).data()?.check as boolean;
  if (enemyCheck === true) {
    battle();
  } else {
    const unsubscribe = onSnapshot(doc(playersRef, playerStore.idEnemy), (doc) => {
      const data = doc.data();
      if (!data) return;
      if (data.check == true) {
        battle();
        //監視を解除する
        unsubscribe();
        console.log(i, "監視を解除しました");
      }
    });
  }
}
//寄付ならば先に処理を行う
export async function donate(): Promise<void> {
  console.log(s, "donateを実行しました");
  //TODO: 寄付の処理を書く
}

//Priorityの比較//!これ間違えてるわ ステータスじゃなくてカードのPriorityを比較する
export async function comparePriority(firstAtkPlayerSign: 0 | 1): Promise<0 | 1> {
  console.log(s, "comparePriorityを実行しました");
  const enemyPriority = (await getDoc(doc(playersRef, playerStore.idEnemy))).data()?.status.priority as number;
  //priorityが大きい方が優先
  if (playerStore.status.priority > enemyPriority) {
    return firstAtkPlayerSign === 0 ? 0 : 1;
  } else if (playerStore.status.priority < enemyPriority) {
    return firstAtkPlayerSign === 0 ? 1 : 0;
  } else {
    return firstAtkPlayerSign;
  }
}
//hungryの比較//!これ間違えてるわ ステータスじゃなくてカードのHungryを比較する
export async function compareHungry(firstAtkPlayerSign: 0 | 1): Promise<0 | 1> {
  console.log(s, "compareHungryを実行しました");
  const enemyHungry = (await getDoc(doc(playersRef, playerStore.idEnemy))).data()?.status.hungry as number;
  //hungryが小さい方が優先
  if (playerStore.status.hungry > enemyHungry) {
    return firstAtkPlayerSign === 0 ? 1 : 0;
  } else if (playerStore.status.hungry < enemyHungry) {
    return firstAtkPlayerSign === 0 ? 0 : 1;
  } else {
    return playerStore.sign;
  }
}
//処理の順番を決める
export async function decideFirstAtkPlayer(): Promise<0 | 1> {
  console.log(s, "decideFirstAtkPlayerを実行しました");
  //順番はPriorityの値を優先する
  let firstAtkPlayerSign: 0 | 1 = 0;
  firstAtkPlayerSign = await compareHungry(firstAtkPlayerSign);
  firstAtkPlayerSign = await comparePriority(firstAtkPlayerSign);
  console.log(i, "firstAtkPlayerSign: " + firstAtkPlayerSign);
  return firstAtkPlayerSign;
}
//ダメージを計算する
//ダメージをFirestoreに保存する
//その値が正しいか確認する

//戦闘処理を統括する
export async function battle(): Promise<void> {
  console.log(s, "calcDamageを実行しました");
  //checkの値がtrueになっていたら､行動済みとする
  playerStore.check = false;
  await updateDoc(doc(playersRef, playerStore.id), { check: playerStore.check });
  //寄付ならば先に処理を行う
  //TODO: Fieldの最初のカードが寄付カードだったら、ここで寄付の処理を行う
  //!これじゃ敵の寄付は処理されないし､
  if (playerStore.field[0].name === "寄付") {
    await donate();
    //寄付の処理が終わったら、checkの値をtrueにする
    playerStore.check = true;
    await updateDoc(doc(playersRef, playerStore.id), { check: playerStore.check });
  }
  //先行後攻を決める
  const firstAtkPlayerSign = await decideFirstAtkPlayer();
  //攻撃を行う
  while (firstAtkPlayerSign === 0) {
    //hungryの値が上限を超えていた場合､行動不能にする(ダメージ計算のときに行動不能の判定を行えばいいかも)
    //ダメージを計算する
    //missionを達成しているか確認する
    //死亡判断を行う
    if(playerStore.status.hp <= 0) {
      console.log(i, "you died");
      // finishGame();
    }
  }
}
//turnを進める
export async function nextTurn(): Promise<void> {
  console.log(s, "nextTurnを実行しました");
  gameStore.turn++;
  playerStore.check = false;
  //incrementを使うと、値を1増やすことができる
  await updateDoc(doc(gamesRef, playerStore.idGame), { turn: increment(1) });
  await updateDoc(doc(playersRef, playerStore.id), { check: playerStore.check });
}

//!すべてのターン管理(最終的な形は未定)
export async function startGame(): Promise<void> {
  gameStore.$state = await getGameData(playerStore.idGame);
}
//!export5日まとめる
