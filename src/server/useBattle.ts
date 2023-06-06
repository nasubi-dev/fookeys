import { toRefs } from "vue";
import { db } from "./firebase";
import { collection, deleteField, doc, getDoc, increment, onSnapshot, updateDoc } from "firebase/firestore";
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
export async function reflectDamage(): Promise<void> {
  console.log(s, "reflectDamageを実行しました");
  const { player, id } = storeToRefs(playerStore);
  const { status } = toRefs(player.value);
  //ダメージを反映する
  status.value = (await getDoc(doc(playersRef, id.value))).data()?.status ?? { hp: 0, hungry: 0, contribution: 0 };
  //missionを達成しているか確認する//!未定
  //死亡判断を行う
  console.log(i, "status: ", status.value.hp, status.value.hungry, status.value.contribution);
  if (status.value.hp <= 0) {
    status.value.hp = 0;
    //TODO: 死亡処理を書く
    console.log(i, "死亡しました");
  }
}
//ダメージを計算する
export async function calcDamage(which: "primary" | "second"): Promise<void> {
  console.log(s, "calcDamageを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { idEnemy, check } = toRefs(player.value);
  let myId = id.value;
  let enemyId = idEnemy.value;
  let myStatus = (await getDoc(doc(playersRef, myId))).data()?.status;
  let enemyStatus = (await getDoc(doc(playersRef, enemyId))).data()?.status;
  let mySumFields = (await getDoc(doc(playersRef, myId))).data()?.sumFields;
  let enemySumFields = (await getDoc(doc(playersRef, enemyId))).data()?.sumFields;
  if (!myStatus || !enemyStatus || !mySumFields || !enemySumFields) {
    console.log(e, "statusが取得できませんでした");
    return;
  }
  //hungryの値が上限を超えていた場合､行動不能にする
  myStatus.hungry += mySumFields.hungry;
  console.log(i, "hungry: ", myStatus.hungry);
  if (myStatus.hungry > 100) {
    console.log(i, "行動不能です");
    myStatus.hungry = 100;
    //TODO: 行動不能の処理を書く
    console.log(i, "限界を超えたので上限の100になりました");
  }

  //支援を行う//!未定
  //防御を行う//?エフェクトのみ//!現在は防御力が後攻でも有効になっている
  let defense = which === "second" ? enemySumFields.def : 0;
  console.log(i, "defense: ", defense);
  //マッスル攻撃を行う
  let holding = mySumFields.pow - defense;
  console.log(i, "holding: ", holding);
  if (holding < 0) holding = 0;
  enemyStatus.hp -= holding;
  defense
    ? console.log(i, "相手のdefが", enemySumFields.def, "なので", holding, "のダメージ")
    : console.log(i, "マッスル攻撃でenemyに", mySumFields.pow, "のダメージ");

  //テクニック攻撃を行う
  enemyStatus.hp -= mySumFields.tech; //?一応防げるギフトがある
  console.log(i, "テクニック攻撃でenemyに", mySumFields.tech, "のダメージ");

  //行動済みにする
  check.value = true;

  console.log(i, "myStatus.hungry: ", myStatus.hungry);
  console.log(i, "enemyStatus.hp: ", enemyStatus.hp);
  await Promise.all([
    updateDoc(doc(playersRef, myId), { "status.hungry": myStatus.hungry }),
    updateDoc(doc(playersRef, enemyId), { "status.hp": enemyStatus.hp }),
    updateDoc(doc(playersRef, myId), { check: check.value }),
  ]);
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
        console.log(i, "受け取ったfirstAtkPlayer: ", firstAtkPlayer.value);
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
  console.log(i, "先行の攻撃");
  if (firstAtkPlayer.value === sign.value) await calcDamage("primary");
  await reflectDamage();

  console.log(i, "後攻の攻撃");
  if (!(firstAtkPlayer.value === sign.value)) await calcDamage("second");
  await reflectDamage();

  await nextTurn(); //turnを進める
}

//turnを進める
export async function nextTurn(): Promise<void> {
  console.log(s, "nextTurnを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { idGame, sign, check } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);

  if (!check.value) console.log(e, "行動していません");
  game.value.turn++;
  //incrementを使うと、値を1増やすことができる
  if (sign.value) updateDoc(doc(gamesRef, idGame.value), { turn: increment(1) });
  console.log(i, "turn: ", game.value.turn);
  check.value = false;
  updateDoc(doc(playersRef, id.value), { check: check.value });
}

//!すべてのターン管理(最終的な形は未定)
export async function startGame(): Promise<void> {
  console.log(s, "startGameを実行しました");
}
//!export5日まとめる
