import { toRefs } from "vue";
import { e, i, s } from "@/log";
import { gameStore, playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, deleteField, doc, getDoc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import { startShop } from "./useShop";
import type { Mission, GameData, PlayerData, PlayerSign } from "@/types";
import allCharacters from "@/assets/allCharacters";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());

//寄付ならば先に処理を行う
export async function donate(): Promise<void> {
  console.log(s, "donateを実行しました");
  const { player, id, log } = storeToRefs(playerStore);
  const { check, donate, idEnemy, field, status } = toRefs(player.value);

  let enemyDonate = (await getDoc(doc(playersRef, idEnemy.value))).data()?.donate ?? false;
  let enemySumFields = (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumFields ?? 0;
  //donateがtrueならば寄付を行う
  if (donate.value) {
    check.value = true;
    updateDoc(doc(playersRef, id.value), { check: true });
    console.log(i, "自分の寄付処理");
    log.value = "自分の寄付処理";
    status.value.contribution += field.value.length * 50;
    updateDoc(doc(playersRef, id.value), { status: status.value });
  }
  if (enemyDonate) {
    updateDoc(doc(playersRef, idEnemy.value), { check: true });
    console.log(i, "敵の寄付処理");
    log.value = "敵の寄付処理";
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
  const { id, player, sign, log } = storeToRefs(playerStore);
  const { idEnemy } = toRefs(player.value);
  const { game } = toRefs(gameStore);
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
  let my = (await getDoc(doc(playersRef, myId))).data();
  let enemy = (await getDoc(doc(playersRef, enemyId))).data();
  if (!my || !my.status || !my.sumFields || !my.field || my.character === undefined) throw Error("自分の情報が取得できませんでした");
  if (!enemy || !enemy.status || !enemy.sumFields || !enemy.field || !enemy.field || enemy.character === undefined)
    throw Error("相手の情報が取得できませんでした");
  //寄付をしていた場合､満腹値を増やさない
  //自分のhungryの値が上限を超えていた場合､行動不能にする
  if (!my.check) {
    my.status.hungry += my.sumFields.hungry;
    console.log(i, "mySumHungry: ", my.status.hungry);
    if (my.status.hungry > 200 + (allCharacters[my.character].maxHungry ?? 0)) {
      my.check = true;
      console.log(i, "自プレイヤー行動不能です");
    }
  }
  //相手のhungryの値が上限を超えていた場合､行動不能にする
  let enemySumHungry = enemy.status.hungry + (which === "primary" ? enemy.sumFields.hungry : 0);
  console.log(i, "enemySumHungry: ", enemySumHungry);
  if (enemySumHungry > 200 + (allCharacters[enemy.character].maxHungry ?? 0)) {
    enemy.check = true;
    console.log(i, "相手プレイヤー行動不能です");
  }

  //支援を行う//!未定
  //防御を行う//?エフェクトのみ
  let defense = 0;
  if (which === "primary") {
    console.log(i, "先行なので防御できない");
  } else {
    if (enemy.check) {
      console.log(i, "敵は行動不能なので防御できない");
    } else {
      defense = enemy.sumFields.def;
      console.log(i, "enemySumFields.def: ", defense);
    }
  }

  //マッスル攻撃を行う
  console.log(i, "マッスル攻撃!!!");
  log.value = "マッスル攻撃!!!";
  let holdingAtk = 0;
  console.log(i, "mySumFields.pow: ", my.sumFields.atk);
  if (my.check) {
    console.log(i, "行動不能なので攻撃できない");
  } else {
    holdingAtk = my.sumFields.atk - defense;
    if (holdingAtk < 0) holdingAtk = 0;
    console.log(i, "holdingAtk: ", holdingAtk);
  }
  enemy.status.hp -= holdingAtk;
  if (defense) {
    console.log(i, "相手のdefが", enemy.sumFields.def, "なので", holdingAtk, "のダメージ");
  } else {
    console.log(i, "マッスル攻撃でenemyに", holdingAtk, "のダメージ");
  }

  //テクニック攻撃を行う
  console.log(i, "テクニック攻撃!!!");
  log.value = "テクニック攻撃!!!";
  let holdingTech = 0;
  if (my.check) {
    console.log(i, "行動不能なので攻撃できない");
    log.value = "行動不能なので攻撃できない";
  } else {
    holdingTech = my.sumFields.tech - 0; //?一応防げるギフトがある
    if (holdingTech < 0) holdingTech = 0;
    console.log(i, "holdingTech: ", holdingTech);
    log.value = "holdingTech: " + holdingTech;
  }
  enemy.status.hp -= my.sumFields.tech;
  console.log(i, "テクニック攻撃でenemyに", my.sumFields.tech, "のダメージ");
  log.value = "テクニック攻撃でenemyに" + my.sumFields.tech + "のダメージ";

  //hungryの値が上限を超えていた場合､上限値にする
  if (my.status.hungry > 100) my.status.hungry = 100;
  //Firebaseに反映する
  await Promise.all([
    updateDoc(doc(playersRef, myId), { "status.hungry": my.status.hungry }),
    updateDoc(doc(playersRef, enemyId), { "status.hp": enemy.status.hp }),
  ]);
}

//missionの統括
async function checkMission(which: "primary" | "second"): Promise<void> {
  console.log(s, "checkMissionを実行しました");
  const { id, player, sign } = storeToRefs(playerStore);
  const { idEnemy, status } = toRefs(player.value);
  const { game, missions } = storeToRefs(gameStore);
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
  let my = (await getDoc(doc(playersRef, myId))).data();
  let enemy = (await getDoc(doc(playersRef, enemyId))).data();
  if (!my || !my.status || !my.sumFields || !my.field || my.character === undefined) throw Error("自分の情報が取得できませんでした");
  if (!enemy || !enemy.status || !enemy.sumFields || !enemy.field || !enemy.field || enemy.character === undefined)
    throw Error("相手の情報が取得できませんでした");

  let ie: number = 0;
  for (let i = 0; i < 3; i++) {
    if (which === "primary") {
      //!ここひどい
      if (firstAtkPlayer.value === sign.value) {
        ie = missions.value[i].checker?.(my.sumFields, my.field) ?? 0;
        missions.value[i].nowAchievement += ie;
      } else {
        ie = missions.value[i].checker?.(enemy.sumFields, enemy.field) ?? 0;
        missions.value[i].nowAchievement += ie;
      }
    } else {
      if (firstAtkPlayer.value === sign.value) {
        ie = missions.value[i].checker?.(my.sumFields, my.field) ?? 0;
        missions.value[i].nowAchievement += ie;
      } else {
        ie = missions.value[i].checker?.(enemy.sumFields, enemy.field) ?? 0;
        missions.value[i].nowAchievement += ie;
      }
    }
    if (missions.value[i].nowAchievement >= missions.value[i].goalAchievement) {
      status.value.contribution += missions.value[i].reward;
      console.log(i, "reward: ", missions.value[i].reward);
    }
  }
}
//指定された､fieldの値を比較する
async function compareSumField(field: "hungry" | "priority"): Promise<void> {
  console.log(s, "compareSum", field, "を実行しました");
  const { player, sign, log } = storeToRefs(playerStore);
  const { idEnemy, sumFields } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);
  log.value = "compareSum" + field + "を実行しました";

  let enemySumFieldsValue = (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumFields[field] ?? 0;
  console.log(i, "sum", field, ": ", sumFields.value[field]);
  log.value = "sum" + field + ": " + sumFields.value[field];
  console.log(i, "enemySum", field, ": ", enemySumFieldsValue);
  log.value = "enemySum" + field + ": " + enemySumFieldsValue;
  //hungryの値が小さい方が先行//hungryの値が同じならばFirstAtkPlayerの値を変更しない
  if (sumFields.value[field] < enemySumFieldsValue) {
    firstAtkPlayer.value = sign.value;
    console.log(i, field, "の値が小さい", firstAtkPlayer.value, "が先行");
    log.value = field + "の値が小さい" + firstAtkPlayer.value + "が先行";
  } else if (sumFields.value[field] > enemySumFieldsValue) {
    //!ここなんとかしたい
    firstAtkPlayer.value = ((sign.value + 1) % 2) as PlayerSign;
    console.log(i, field, "の値が小さい", firstAtkPlayer.value, "が先行");
    log.value = field + "の値が小さい" + firstAtkPlayer.value + "が先行";
  } else {
    console.log(i, field, "の値が同じなので");
    log.value = field + "の値が同じなので";
  }
}
//firstAtkPlayerの値の監視
async function watchFirstAtkPlayerField(): Promise<void> {
  console.log(s, "watchFirstAtkPlayerFieldを実行しました");
  const { player, sign, log } = storeToRefs(playerStore);
  const { idGame } = toRefs(player.value);
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
        log.value = "受け取ったfirstAtkPlayer: " + firstAtkPlayer.value;
        //監視を解除する
        unsubscribe();
        console.log(i, "firstAtkPlayerの監視を解除しました");
      }
    });
  } else {
    //先行後攻を決める//0か1をランダムに生成
    firstAtkPlayer.value = Math.random() < 0.5 ? 0 : 1;
    console.log(i, "ランダムで決まったplayer: ", firstAtkPlayer.value);
    log.value = "ランダムで決まったplayer: " + firstAtkPlayer.value;
    updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: firstAtkPlayer.value });
  }
}

//戦闘処理を統括する
export async function battle() {
  console.log(s, "battleを実行しました");
  const { id, player, log } = storeToRefs(playerStore);
  const { check } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

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
  log.value = "結果...firstAtkPlayer: " + firstAtkPlayer.value;

  console.log(i, "先行の攻撃");
  log.value = "先行の攻撃";
  await calcDamage("primary");
  await reflectDamage();
  await checkMission("primary");

  console.log(i, "後攻の攻撃");
  log.value = "後攻の攻撃";
  await calcDamage("second");
  await reflectDamage();
  await checkMission("second");

  //戦後処理
  await postBattle();
}
//戦闘後の処理
export async function postBattle(): Promise<void> {
  console.log(s, "postBattleを実行しました");
  const { reduceWaste, deleteField } = playerStore;
  const { id, player, cardLock, sign, log } = storeToRefs(playerStore);
  const { check, idGame, isSelectedGift } = toRefs(player.value);
  const { nextTurn } = gameStore;
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  //行動していないならばエラーを返す
  // if (!check.value) throw new Error("checkの値がfalse､つまり行動していません");
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
  //isSelectedGiftの値をundefinedにする
  isSelectedGift.value = undefined;
  //firstAtkPlayerの値をundefinedにする
  firstAtkPlayer.value = undefined;

  //shopを開く
  startShop();
}
//!export5日まとめる
