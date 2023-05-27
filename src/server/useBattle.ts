import { toRefs } from "vue";
import { db } from "./firebase";
import { collection, doc, getDoc, updateDoc, getDocs, onSnapshot, arrayUnion, increment } from "firebase/firestore";
import { e, s, i } from "@/log";
import type { Card, Mission } from "@/types";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";

//Collectionの参照
const missionsRef = collection(db, "missions");
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");
const deckRef = collection(db, "deck");

//cardをランダムに一枚引く
async function drawCard(): Promise<Card> {
  const deck = (await getDocs(deckRef)).docs.map((doc) => doc.data());
  const selectCard = deck[Math.floor(Math.random() * deck.length)];
  return selectCard as Card;
}
//cardをHandに6枚セットする
export async function setHand(): Promise<void> {
  const { id, player } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  for (let i = 0; i < 6; i++) {
    const card = await drawCard();
    hand.value.push(card as Card);
    hand.value.sort((a, b) => a.id - b.id);
    updateDoc(doc(playersRef, id.value), { hand: hand.value });
  }
}
//指定のcardを一枚引く
//Cardを三枚提示する
//missionを3つセットする
export async function setMissions(): Promise<void> {
  const { player } = storeToRefs(playerStore);
  const { game } = storeToRefs(gameStore);
  const { idGame } = toRefs(player.value);
  const { missions } = toRefs(game.value);

  if (playerStore.player.sign == 0) {
    //!みかん
    const unsubscribe = onSnapshot(doc(gamesRef, idGame.value), (doc) => {
      missions.value = doc.data()?.missions;
    });
    return;
  }
  const allMissions = (await getDocs(missionsRef)).docs.map((doc) => doc.data());
  for (let i = 0; i < 3; i++) {
    const selectMission = allMissions[Math.floor(Math.random() * allMissions.length)] as Mission;
    missions.value.push(selectMission);
    //選ばれたミッションはmissionsから削除する
    allMissions.splice(allMissions.indexOf(selectMission), 1);
    //Firestoreにmissionsを保存する
    //arrayUnionを使うと、配列に要素を追加できる(arrayRemoveで削除もできる)
    //TODO: 一つづつ追加するのではなく、一度に追加するか悩み中
    await updateDoc(doc(gamesRef, idGame.value), { missions: arrayUnion(selectMission) });
  }
}

//checkの値の監視
export async function watchTurnEnd(): Promise<void> {
  const { id, player, sumCards } = storeToRefs(playerStore);
  const { check, idEnemy, sumField } = toRefs(player.value);

  //checkの値がtrueになっていたら､カード選択終了
  check.value = true;
  updateDoc(doc(playersRef, id.value), { check: check.value });
  console.log(i, "check: " + check.value);
  //FieldのカードをFirestoreに保存する
  sumField.value = sumCards.value;
  updateDoc(doc(playersRef, id.value), { sumField: sumField.value });
  const enemyCheck = (await getDoc(doc(playersRef, idEnemy.value))).data()?.check as boolean;
  if (enemyCheck === true) {
    battle();
  } else {
    const unsubscribe = onSnapshot(doc(playersRef, idEnemy.value), (doc) => {
      const data = doc.data();
      if (!data) return;
      if (data.check) {
        battle();
        //監視を解除する
        unsubscribe();
        console.log(i, "checkの監視を解除しました");
      }
    });
  }
}

//処理の順番を決める
export async function decideFirstAtkPlayer(): Promise<0 | 1> {
  console.log(s, "decideFirstAtkPlayerを実行しました");
  const { player } = storeToRefs(playerStore);
  const { idEnemy, sign, sumField } = toRefs(player.value);

  //先行後攻を決める//0か1をランダムに生成//?ここの型キモすぎる
  //!ランダムな値を両プレイヤーで共有する方法がわからん
  let firstAtkPlayer: 0 | 1 = 0; //Math.random() * 2 ? 0 : 1;
  const enemySumHungry = (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumField.hungry as number;
  //hungryの値が小さい方が先行//hungryの値が同じならばFirstAtkPlayerの値を変更しない
  console.log(i, "sumFieldHungry: ", sumField.value.hungry);
  console.log(i, "SumEnemyHungry: ", enemySumHungry);

  if (sumField.value.hungry < enemySumHungry) {
    firstAtkPlayer = sign.value;
  } else if (sumField.value.hungry > enemySumHungry) {
    firstAtkPlayer = (sign.value + 1) % 2 ? 0 : 1;
  }
  //Priorityの値が大きい方が先行に上書き//Priorityの値が同じならばFirstAtkPlayerの値を変更しない

  console.log(i, "firstAtkPlayer: ", firstAtkPlayer);
  return firstAtkPlayer;
}
//寄付ならば先に処理を行う
export async function donate(): Promise<void> {
  console.log(s, "donateを実行しました");
  playerStore.player.check = true;
  //TODO: 寄付の処理を書く
}
//ダメージを計算する
//ダメージをFirestoreに保存する
//その値が正しいか確認する

//戦闘処理を統括する
export async function battle(): Promise<void> {
  console.log(s, "battleを実行しました");
  const { id, player, firstAtkPlayer } = storeToRefs(playerStore);
  const { check, field, status } = toRefs(player.value);

  //checkの値がtrueになっていたら､行動済みとする
  check.value = false;
  await updateDoc(doc(playersRef, id.value), { check: check.value });
  //寄付ならば先に処理を行う
  //TODO: Fieldの最初のカードが寄付カードだったら、ここで寄付の処理を行う
  if (field.value[0].name === "foodBank") donate();
  //先行後攻を決める
  firstAtkPlayer.value = await decideFirstAtkPlayer();
  //攻撃を行う
  //hungryの値が上限を超えていた場合､行動不能にする(ダメージ計算のときに行動不能の判定を行えばいいかも)
  //ダメージを計算する
  //missionを達成しているか確認する
  //死亡判断を行う
}

//turnを進める
export async function nextTurn(): Promise<void> {
  console.log(s, "nextTurnを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { idGame, check } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);

  game.value.turn++;
  check.value = false;
  //incrementを使うと、値を1増やすことができる
  updateDoc(doc(gamesRef, idGame.value), { turn: increment(1) });
  updateDoc(doc(playersRef, id.value), { check: check.value });
}

//!すべてのターン管理(最終的な形は未定)
export async function startGame(): Promise<void> {
  console.log(s, "startGameを実行しました");
}
//!export5日まとめる
