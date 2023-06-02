import { toRefs } from "vue";
import { db } from "./firebase";
import { collection, deleteField, doc, getDoc, getDocs, increment, onSnapshot, query, updateDoc } from "firebase/firestore";
import { storeToRefs } from "pinia";
import { e, i, s } from "@/log";
import { converter } from "@/server/converter";
import type { Card, Mission, GameData, PlayerData, PlayerSign } from "@/types";
import { gameStore, playerStore } from "@/main";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());
const missionsRef = collection(db, "missions").withConverter(converter<Mission>());
const deckRef = collection(db, "deck").withConverter(converter<Card>());

//ダメージを反映する
export async function reflectDamage(which: "primary" | "second"): Promise<void> {
  console.log(s, "reflectDamageを実行しました");
  const { player } = storeToRefs(playerStore);
  const { sign, status, idEnemy } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);
  //ダメージを反映する
  if (which === "primary") {
    if (!(firstAtkPlayer.value === sign.value)) {
      status.value.hp -= (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumFields.pow ?? 0;
    }
  } else {
    if (firstAtkPlayer.value === sign.value) {
      status.value.hp -= (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumFields.pow ?? 0;
    }
  }
  //missionを達成しているか確認する//!未定
  //死亡判断を行う
  console.log(i, "hp: ", status.value.hp);
  if (status.value.hp <= 0) {
    status.value.hp = 0;
    //TODO: 死亡処理を書く
    console.log(i, "死亡しました");
  }
}
//ダメージを計算する
export async function calcDamage(): Promise<void> {
  console.log(s, "calcDamageを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { sumFields, idEnemy } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);
  let myId = id.value;
  let enemyId = idEnemy.value;

  let myStatus = (await getDoc(doc(playersRef, myId))).data()?.status;
  let enemyStatus = (await getDoc(doc(playersRef, enemyId))).data()?.status;
  let mySumFields = (await getDoc(doc(playersRef, myId))).data()?.sumFields;
  let enemySumFields = (await getDoc(doc(playersRef, enemyId))).data()?.sumFields;
  if (myStatus === undefined) return;
  if (enemyStatus === undefined) return;
  if (mySumFields === undefined) return;
  if (enemySumFields === undefined) return;
  //hungryの値が上限を超えていた場合､行動不能にする(ダメージ計算のときに行動不能の判定を行えばいいかも)
  myStatus.hungry += sumFields.value.hungry;
  console.log(i, "hungry: ", myStatus.hungry);
  if (myStatus.hungry > 100) {
    console.log(i, "行動不能です");
    myStatus.hungry = 100;
    //TODO: 行動不能の処理を書く
  }
  //支援を行う//!未定
  //防御を行う//?エフェクトのみ
  //マッスル攻撃を行う
  let holding = mySumFields.pow - enemySumFields.def;
  if (holding < 0) holding = 0;
  enemyStatus.hp -= holding;
  console.log(i, "マッスル攻撃でenemyに", mySumFields.pow, "のダメージ");
  if (enemySumFields.def === 0) console.log(i, "相手のdefが", enemySumFields.def, "なので", holding, "のダメージ");
  //テクニック攻撃を行う
  enemyStatus.hp -= mySumFields.tech;
  console.log(i, "テクニック攻撃でenemyに", mySumFields.tech, "のダメージ");
  updateDoc(doc(playersRef, myId), { status: myStatus });
  updateDoc(doc(playersRef, enemyId), { status: enemyStatus });
}

//指定された､fieldの値を比較する
async function compareSumField(field: "hungry" | "priority"): Promise<void> {
  console.log(s, "compareSum", field, "を実行しました");
  const { player } = storeToRefs(playerStore);
  const { idEnemy, sumFields, sign } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  let enemySumField = (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumFields[field] ?? 0;
  console.log(i, "sum", field, ": ", sumFields.value[field]);
  console.log(i, "enemySum", field, ": ", enemySumField);
  //hungryの値が小さい方が先行//hungryの値が同じならばFirstAtkPlayerの値を変更しない
  if (sumFields.value[field] < enemySumField) {
    firstAtkPlayer.value = sign.value;
    console.log(i, field, "の値が小さい", firstAtkPlayer.value, "が先行");
  } else if (sumFields.value[field] > enemySumField) {
    //!ここなんとかしたい
    firstAtkPlayer.value = ((sign.value + 1) % 2) as PlayerSign;
    console.log(i, field, "の値が小さい", firstAtkPlayer.value, "が先行");
  } else {
    console.log(i, field, "の値が同じなので");
  }
}
//処理の順番を決める

//firstAtkPlayerの値の監視
export async function watchFirstAtkPlayerField(): Promise<void> {
  console.log(s, "watchFirstAtkPlayerFieldを実行しました");
  const { player } = storeToRefs(playerStore);
  const { sign, idGame } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  if (sign.value == 1) {
    const unsubscribe = onSnapshot(doc(gamesRef, idGame.value), (snap) => {
      const data = snap.data();
      if (!data) return;
      if (data.firstAtkPlayer !== undefined) {
        firstAtkPlayer.value = data.firstAtkPlayer === 0 ? 0 : 1;
        //監視を解除する
        unsubscribe();
        console.log(i, "firstAtkPlayerの監視を解除しました");
        updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: deleteField() });
        console.log(i, firstAtkPlayer.value);
      }
    });
  } else {
    //先行後攻を決める//0か1をランダムに生成
    firstAtkPlayer.value = Math.random() < 0.5 ? 0 : 1;
    console.log(i, "ランダムで決まったplayer: ", firstAtkPlayer.value);
    await updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: firstAtkPlayer.value });
  }
}

//寄付ならば先に処理を行う
// export async function donate(): Promise<void> {
//   console.log(s, "donateを実行しました");
//   playerStore.player.check = true;
//   //TODO: 寄付の処理を書く
// }
//その値が正しいか確認する

//戦闘処理を統括する
export async function battle() {
  console.log(s, "battleを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { check, sign } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  //checkの値がtrueになっていたら､行動済みとする
  check.value = false;
  updateDoc(doc(playersRef, id.value), { check: check.value });
  //寄付ならば先に処理を行う
  //TODO: Fieldの最初のカードが寄付カードだったら、ここで寄付の処理を行う
  // if (field.value[0].name === "foodBank") donate();
  //先行後攻を決める
  await watchFirstAtkPlayerField();

  await compareSumField("hungry");
  await compareSumField("priority");
  console.log(i, "結果...firstAtkPlayer: ", firstAtkPlayer.value);
  if (firstAtkPlayer.value === undefined) {
    console.log(e, "firstAtkPlayerの値がundefinedです");
    return;
  }
  //先行のダメージを計算する
  console.log(i, "先行の攻撃");
  if (firstAtkPlayer.value === sign.value) await calcDamage();
  //ダメージを反映する
  await reflectDamage("primary");
  //後攻のダメージを計算する
  console.log(i, "後攻の攻撃");
  if (!(firstAtkPlayer.value === sign.value)) await calcDamage();
  //ダメージを反映する
  await reflectDamage("second");
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
