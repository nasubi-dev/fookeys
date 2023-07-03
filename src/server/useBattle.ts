import { toRefs } from "vue";
import { db } from "./firebase";
import { collection, deleteField, doc, getDoc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { storeToRefs } from "pinia";
import { e, i, s } from "@/log";
import { converter } from "@/server/converter";
import { startShop } from "./useShop";
import type { Mission, GameData, PlayerData, PlayerSign } from "@/types";
import { gameStore, playerStore } from "@/main";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());

//寄付ならば先に処理を行う
export async function donate(): Promise<void> {
  console.log(s, "donateを実行しました");
  const { player, id } = storeToRefs(playerStore);
  const { check, donate, idEnemy, field, status } = toRefs(player.value);

  let enemyDonate = (await getDoc(doc(playersRef, idEnemy.value))).data()?.donate ?? false;
  let enemySumFields = (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumFields ?? 0;
  //donateがtrueならば寄付を行う
  if (donate.value) {
    check.value = true;
    updateDoc(doc(playersRef, id.value), { check: true });
    console.log(i, "自分の寄付処理");
    status.value.contribution += field.value.length * 50;
    updateDoc(doc(playersRef, id.value), { status: status.value });
    console.log(i, "contribution: ", status.value.contribution);
  }
  if (enemyDonate) {
    updateDoc(doc(playersRef, idEnemy.value), { check: false });
    console.log(i, "敵の寄付処理");
    //?現状だと相手のStatusを表示していないので､今は書かない
    //?書くのはアニメーションだけでいい
  }
}
//ダメージを反映する
async function reflectDamage(): Promise<void> {
  console.log(s, "reflectDamageを実行しました");
  const { player, id } = storeToRefs(playerStore);
  const { status } = toRefs(player.value);
  //ダメージを反映する
  status.value = (await getDoc(doc(playersRef, id.value))).data()?.status ?? { hp: 0, hungry: 0, contribution: 0 };
  console.log(i, "status: ", status.value.hp, status.value.hungry, status.value.contribution);
}
//ダメージを計算する
async function calcDamage(which: "primary" | "second"): Promise<void> {
  console.log(s, "calcDamageを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { idEnemy, sign,check } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  //自分と相手のidを取得する
  let myId, enemyId;
  if (firstAtkPlayer.value === sign.value) {
    myId = which === "primary" ? id.value : idEnemy.value;
    enemyId = which === "primary" ? idEnemy.value : id.value;
  } else {
    myId = which === "primary" ? idEnemy.value : id.value;
    enemyId = which === "primary" ? id.value : idEnemy.value;
  }
  //statusを取得する
  let myStatus = (await getDoc(doc(playersRef, myId))).data()?.status;
  let enemyStatus = (await getDoc(doc(playersRef, enemyId))).data()?.status;
  let mySumFields = (await getDoc(doc(playersRef, myId))).data()?.sumFields;
  let enemySumFields = (await getDoc(doc(playersRef, enemyId))).data()?.sumFields;
  let myCheck = (await getDoc(doc(playersRef, myId))).data()?.check;
  let enemyCheck = (await getDoc(doc(playersRef, enemyId))).data()?.check;
  if (!myStatus || !enemyStatus || !mySumFields || !enemySumFields || myCheck === undefined || enemyCheck === undefined) {
    console.log(e, "情報が取得できませんでした");
    return;
  }

  //寄付をしていた場合､満腹値を増やさない
  if (!myCheck) {
    //自分のhungryの値が上限を超えていた場合､行動不能にする
    myStatus.hungry += mySumFields.hungry;
    console.log(i, "mySumHungry: ", myStatus.hungry);
    if (myStatus.hungry > 100) {
      myCheck = true;
      console.log(i, "自プレイヤー行動不能です");
    }
  }
  //相手のhungryの値が上限を超えていた場合､行動不能にする
  let enemySumHungry = enemySumFields.hungry + enemyStatus.hungry;
  console.log(i, "enemySumHungry: ", enemySumHungry);
  if (enemySumHungry > 100) {
    enemyCheck = true;
    console.log(i, "相手プレイヤー行動不能です");
  }
  //支援を行う//!未定
  //防御を行う//?エフェクトのみ
  let defense = 0;
  if (which === "primary") console.log(i, "先行なので防御できない");
  else {
    if (enemyCheck) console.log(i, "敵は行動不能なので防御できない");
    else {
      defense = enemySumFields.def;
      console.log(i, "enemySumFields.def: ", defense);
    }
  }

  //マッスル攻撃を行う
  console.log(i, "マッスル攻撃!!!");
  let holdingAtk = 0;
  console.log(i, "mySumFields.pow: ", mySumFields.pow);
  if (myCheck) console.log(i, "行動不能なので攻撃できない");
  else {
    holdingAtk = mySumFields.pow - defense;
    if (holdingAtk < 0) holdingAtk = 0;
    console.log(i, "holdingAtk: ", holdingAtk);
  }
  enemyStatus.hp -= holdingAtk;
  defense
    ? console.log(i, "相手のdefが", enemySumFields.def, "なので", holdingAtk, "のダメージ")
    : console.log(i, "マッスル攻撃でenemyに", holdingAtk, "のダメージ");

  //テクニック攻撃を行う
  console.log(i, "テクニック攻撃!!!");
  let holdingTech = 0;
  if (myCheck) console.log(i, "行動不能なので攻撃できない");
  else {
    holdingTech = mySumFields.tech - 0; //?一応防げるギフトがある
    if (holdingTech < 0) holdingTech = 0;
    console.log(i, "holdingTech: ", holdingTech);
  }
  enemyStatus.hp -= mySumFields.tech;
  console.log(i, "テクニック攻撃でenemyに", mySumFields.tech, "のダメージ");

  //hungryの値が上限を超えていた場合､上限値にする
  if (myStatus.hungry > 100) myStatus.hungry = 100;

  //行動したのでcheckをtrueにする
  check.value = true;

  //Firebaseに反映する
  await Promise.all([
    updateDoc(doc(playersRef, myId), { "status.hungry": myStatus.hungry }),
    updateDoc(doc(playersRef, enemyId), { "status.hp": enemyStatus.hp }),
    updateDoc(doc(playersRef, myId), { check: check.value }),
  ]);
}
//missionが達成されているか確認する
async function checkMission(): Promise<void> {
  console.log(s, "checkMissionを実行しました");
}

//指定された､fieldの値を比較する
async function compareSumField(field: "hungry" | "priority"): Promise<void> {
  console.log(s, "compareSum", field, "を実行しました");
  const { player } = storeToRefs(playerStore);
  const { idEnemy, sumFields, sign } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  let enemySumFieldsValue = (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumFields[field] ?? 0;
  console.log(i, "sum", field, ": ", sumFields.value[field]);
  console.log(i, "enemySum", field, ": ", enemySumFieldsValue);
  //hungryの値が小さい方が先行//hungryの値が同じならばFirstAtkPlayerの値を変更しない
  if (sumFields.value[field] < enemySumFieldsValue) {
    firstAtkPlayer.value = sign.value;
    console.log(i, field, "の値が小さい", firstAtkPlayer.value, "が先行");
  } else if (sumFields.value[field] > enemySumFieldsValue) {
    //!ここなんとかしたい
    firstAtkPlayer.value = ((sign.value + 1) % 2) as PlayerSign;
    console.log(i, field, "の値が小さい", firstAtkPlayer.value, "が先行");
  } else {
    console.log(i, field, "の値が同じなので");
  }
}
//firstAtkPlayerの値の監視
async function watchFirstAtkPlayerField(): Promise<void> {
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
        updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: deleteField() });
        console.log(i, "受け取ったfirstAtkPlayer: ", firstAtkPlayer.value);
        //監視を解除する
        unsubscribe();
        console.log(i, "firstAtkPlayerの監視を解除しました");
      }
    });
  } else {
    //先行後攻を決める//0か1をランダムに生成
    firstAtkPlayer.value = Math.random() < 0.5 ? 0 : 1;
    console.log(i, "ランダムで決まったplayer: ", firstAtkPlayer.value);
    await updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: firstAtkPlayer.value });
  }
}

//戦闘処理を統括する
export async function battle() {
  console.log(s, "battleを実行しました");
  const { id, player, phase } = storeToRefs(playerStore);
  const { check } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  //phaseをbattleにする
  phase.value = "battle";
  console.log(i, "phase: ", phase.value);
  //checkの値がtrueになっていたら､行動済みとする
  check.value = false;
  updateDoc(doc(playersRef, id.value), { check: check.value });

  //寄付ならば先に処理を行う
  await donate();
  //先行後攻を決める
  await watchFirstAtkPlayerField();
  await compareSumField("hungry");
  await compareSumField("priority");
  if (firstAtkPlayer.value === undefined) throw new Error("firstAtkPlayerの値がundefinedです");
  else console.log(i, "結果...firstAtkPlayer: ", firstAtkPlayer.value);

  console.log(i, "先行の攻撃");
  await calcDamage("primary");
  await reflectDamage();
  await checkMission();

  console.log(i, "後攻の攻撃");
  await calcDamage("second");
  await reflectDamage();
  await checkMission();

  //戦後処理
  await postBattle();
}
//戦闘後の処理
export async function postBattle(): Promise<void> {
  console.log(s, "postBattleを実行しました");
  const { reduceWaste, deleteField } = playerStore;
  const { id, player, cardLock } = storeToRefs(playerStore);
  const { check, sign, idGame } = toRefs(player.value);
  const { nextTurn } = gameStore;

  if (!check.value) throw new Error("checkの値がfalse､つまり行動していません");
  //使ったカードを捨てる
  deleteField();
  //handの腐り値を減らす(腐り値が0になったらhandから削除する)
  reduceWaste();
  updateDoc(doc(playersRef, id.value), { hand: player.value.hand });
  //満腹値を減らす

  //turnを進める
  nextTurn();
  if (sign.value) updateDoc(doc(gamesRef, idGame.value), { turn: increment(1) });

  //checkの値をfalseにする(初期値に戻す)
  check.value = false;
  updateDoc(doc(playersRef, id.value), { check: check.value });
  //cardLockの値をfalseにする(初期値に戻す)
  cardLock.value = false;

  //shopを開く
  startShop();
}
//!export5日まとめる
