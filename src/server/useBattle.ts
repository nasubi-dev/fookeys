import { toRefs } from "vue";
import { e, i, s } from "@/log";
import { gameStore, playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, deleteField, doc, getDoc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import { startShop } from "./useShop";
import { changeHandValue, changeStatusValue, changeSumCardsValue, draw3ExchangedCard, drawOneCard } from "./useShopUtils";
import type { GameData, PlayerData, PlayerSign, Status, SumCards } from "@/types";
import { getEnemyPlayer } from "./usePlayerData";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());

//指定されたmsだけ待機する
export const wait = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
};
//Playerを同期する
export async function syncPlayer(
  which: "primary" | "second"
): Promise<{ myId: string; enemyId: string; my: PlayerData; enemy: PlayerData }> {
  const { id, player, sign } = storeToRefs(playerStore);
  const { idEnemy } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  //自分と相手のidを取得する
  let myId, enemyId;
  const a = firstAtkPlayer.value === sign.value ? 1 : 0;
  if (a) {
    myId = which === "primary" ? id.value : idEnemy.value;
    enemyId = which === "primary" ? idEnemy.value : id.value;
  } else {
    myId = which === "primary" ? idEnemy.value : id.value;
    enemyId = which === "primary" ? id.value : idEnemy.value;
  }
  //statusを取得する
  let my = (await getDoc(doc(playersRef, myId))).data() as PlayerData;
  let enemy = (await getDoc(doc(playersRef, enemyId))).data() as PlayerData;
  if (!my) throw Error("自分の情報が取得できませんでした");
  if (!enemy) throw Error("相手の情報が取得できませんでした");
  return { myId, enemyId, my, enemy };
}

//ダメージを反映する
async function reflectStatus(): Promise<void> {
  console.log(s, "reflectDamageを実行しました");
  const { player, id } = storeToRefs(playerStore);
  const { status } = toRefs(player.value);
  //ダメージを反映する
  let myPlayerData = (await getDoc(doc(playersRef, id.value))).data()?.status as Status;
  if (!myPlayerData) throw Error("myStatusが取得できませんでした");
  status.value = myPlayerData;
}
//ダメージを計算する
async function calcDamage(which: "primary" | "second"): Promise<void> {
  console.log(s, "calcDamageを実行しました");
  const { sign, battleResult, log } = storeToRefs(playerStore);
  const { game } = toRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);
  const { myId, enemyId, my, enemy } = await syncPlayer(which);
  const a = firstAtkPlayer.value === sign.value ? 1 : 0;

  //fieldが空の場合､ダメージ計算を行わない
  if (my.field.length === 0) return;
  //寄付をしていた場合､ダメージ計算を行わない
  if (my.donate) {
    console.log(i, "寄付をしていたのでダメージ計算を行いません");
    my.status.contribution += my.field.length * 50;
    if (a) updateDoc(doc(playersRef, myId), { status: my.status });
    await wait(1000);
    await reflectStatus();
    await getEnemyPlayer(); //!ここでenemyPlayerの値を更新する
    battleResult.value = ["donate", my.field.length * 50];
    await wait(2000);
    battleResult.value = ["none", 0];
    return;
  }

  //自分のhungryの値が上限を超えていた場合､行動不能にする
  my.status.hungry += my.sumFields.hungry;
  console.log(i, "mySumHungry: ", my.status.hungry);
  if (my.status.hungry > my.status.maxHungry) {
    my.check = true;
    updateDoc(doc(playersRef, myId), { check: my.check });
    console.log(i, "自プレイヤー行動不能です");
    //hungryの値が上限を超えていた場合､上限値にする
    if (my.status.hungry > my.status.maxHungry) my.status.hungry = my.status.maxHungry;
  }

  if (a) updateDoc(doc(playersRef, myId), { "status.hungry": my.status.hungry });
  await wait(1000);
  await reflectStatus();
  await getEnemyPlayer(); //!
  if (my.check) {
    battleResult.value = ["hungry", my.check ? 1 : 0]; //?1は行動不能
    await wait(2000);
  }

  //自分がこのターン､寄付を行ったか行動不能の場合､ダメージ計算を行わない
  if (my.check) return;

  //相手のhungryの値が上限を超えていた場合､相手を行動不能にする
  let enemySumHungry = enemy.status.hungry + (which === "primary" ? enemy.sumFields.hungry : 0);
  if (enemySumHungry > enemy.status.maxHungry) {
    enemy.check = true;
    updateDoc(doc(playersRef, enemyId), { check: enemy.check });
    console.log(i, "相手プレイヤー行動不能です");
    //hungryの値が上限を超えていた場合､上限値にする
    if (enemySumHungry > enemy.status.maxHungry) enemySumHungry = enemy.status.maxHungry;
  }

  //回復を行う
  if (my.field.map((card) => card.attribute).includes("heal")) {
    my.status.hp += my.sumFields.heal;
    if (my.status.hp > my.status.maxHp) my.status.hp = my.status.maxHp;
    console.log(i, "heal: ", my.sumFields.heal);

    if (a) updateDoc(doc(playersRef, myId), { "status.hp": my.status.hp });
    await wait(1000);
    await reflectStatus();
    await getEnemyPlayer(); //!
    battleResult.value = ["heal", my.sumFields.heal];
    await wait(2000);
  }

  //支援を行う
  if (my.field.map((card) => card.attribute).includes("sup")) {
    my.field.forEach((card) => {
      if(!card.description) return;
      log.value = card.name + "の効果!" + card.description;
      if (card.id === 58) changeHandValue("atk", 10, "atk");
      if (card.id === 64) changeStatusValue("maxHungry", 20);
    });

    await wait(1000);
    await reflectStatus();
    await getEnemyPlayer(); //!
    battleResult.value = ["sup", 0]; //!未定
    await wait(2000);
  }

  let defense = 0;
  if (which === "primary") {
    console.log(i, "先行なので防御できない");
  } else {
    if (enemy.check) {
      console.log(i, "敵は行動不能なので防御できない");
    } else if (enemy.donate) {
      console.log(i, "敵は寄付をしていたので防御できない");
      log.value = "敵は寄付をしていたので防御できない";
    } else {
      defense = enemy.sumFields.def;
      console.log(i, "enemySumFields.def: ", defense);
    }
  }

  //防御を行う//?エフェクトのみ
  if (my.field.map((card) => card.attribute).includes("def")) {
    await wait(1000);
    await reflectStatus();
    await getEnemyPlayer(); //!
    battleResult.value = ["def", my.sumFields.def];
    await wait(2000);
  }

  //マッスル攻撃を行う
  if (my.field.map((card) => card.attribute).includes("atk")) {
    console.log(i, "マッスル攻撃!!!");
    //特殊効果を発動する
    my.field.forEach((card) => {
      if(!card.description) return;
      log.value = card.name + "の効果!" + card.description;
      if (card.id === 10) defense = 0;
    });

    let holdingAtk = 0;
    console.log(i, "mySumFields.atk: ", my.sumFields.atk);
    if (my.check) log.value = "行動不能なので攻撃できない";
    else {
      holdingAtk = my.sumFields.atk - defense;
      if (holdingAtk < 0) holdingAtk = 0;
      console.log(i, "holdingAtk: ", holdingAtk);
    }
    enemy.status.hp -= holdingAtk;
    if (defense !== 0) {
      console.log(i, "相手のdefが", enemy.sumFields.def, "なので", holdingAtk, "のダメージ");
    } else {
      console.log(i, "マッスル攻撃でenemyに", holdingAtk, "のダメージ");
    }

    if (a) updateDoc(doc(playersRef, enemyId), { "status.hp": enemy.status.hp });
    await wait(1000);
    await reflectStatus();
    await getEnemyPlayer(); //!
    battleResult.value = ["atk", my.sumFields.atk];
    await wait(2000);
  }

  //テクニック攻撃を行う
  if (my.field.map((card) => card.attribute).includes("tech")) {
    console.log(i, "テクニック攻撃!!!");
    //特殊効果を発動する
    my.field.forEach((card) => {
      if(!card.description) return;
      log.value = card.name + "の効果!" + card.description;
      if (card.id === 17 || card.id === 20) changeStatusValue("contribution", 5);
      if (card.id === 26) changeStatusValue("contribution", 20);
      if (card.id === 29 || card.id === 31) enemy.status.hungry >= 100 ? (my.sumFields.tech += 30) : null;
    });

    let techDefense = 0;
    let holdingTech = 0;
    if (my.check) {
      console.log(i, "行動不能なので攻撃できない");
    } else {
      holdingTech = my.sumFields.tech - techDefense; //?一応防げるギフトがある
      if (holdingTech < 0) holdingTech = 0;
      console.log(i, "holdingTech: ", holdingTech);
    }
    enemy.status.hp -= my.sumFields.tech;

    if (a) updateDoc(doc(playersRef, enemyId), { "status.hp": enemy.status.hp });
    await wait(1000);
    await reflectStatus();
    await getEnemyPlayer(); //!
    battleResult.value = ["tech", holdingTech];
    await wait(2000);
  }

  battleResult.value = ["none", 0];
}

//missionの統括
async function checkMission(which: "primary" | "second"): Promise<void> {
  console.log(s, "checkMissionを実行しました");
  const { id, player, sign, log } = storeToRefs(playerStore);
  const { status } = toRefs(player.value);
  const { game, missions } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);
  const { my, enemy } = await syncPlayer(which);

  if (my.check) {
    log.value = "行動不能だったのでミッションは進行しませんでした";
    return;
  }
  //missionを進捗させる
  const equalPlayerSign = sign.value === firstAtkPlayer.value;
  for (let mission of missions.value ?? []) {
    if (mission.achieved) continue;
    //Missionを進捗させる
    mission.nowAchievement += mission.checker?.(my.donate, my.sumFields, my.field, my.hand) ?? 0;
    //Missionを達成したら報酬を受け取る
    if (mission.nowAchievement >= mission.goalAchievement) {
      mission.achieved = true;
      mission.nowAchievement = mission.goalAchievement;
      if (equalPlayerSign && which === "primary") {
        status.value.contribution += mission.reward;
        console.log(i, "mission: " + mission.name + "を達成したので", mission.reward, "の貢献度を受け取りました");
        log.value = "mission: " + mission.name + "を達成したので" + mission.reward + "の貢献度を受け取りました";
      } else if (!equalPlayerSign && which === "second") {
        status.value.contribution += mission.reward;
        console.log(i, "mission: " + mission.name + "を達成したので", mission.reward, "の貢献度を受け取りました");
        log.value = "mission: " + mission.name + "を達成したので" + mission.reward + "の貢献度を受け取りました";
      }
      updateDoc(doc(playersRef, id.value), { status: status.value });
    }
  }
}
//donateの場合､優先度は最上位になる
async function judgeDonate(): Promise<void> {
  console.log(s, "comparePriorityを実行しました");
  const { id, player, sign } = storeToRefs(playerStore);
  const { idEnemy, donate } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  //donateの値がtrueの場合､優先度は最上位になる
  const getSwitchedPlayerSign = (playerSign: PlayerSign): PlayerSign => (playerSign === 0 ? 1 : 0);
  const isEnemyDonate = (await getDoc(doc(playersRef, idEnemy.value))).data()?.donate;
  let newFirstAtkPlayer: PlayerSign | undefined = firstAtkPlayer.value;

  if (firstAtkPlayer.value === sign.value) {
    if (donate.value) newFirstAtkPlayer = sign.value;
    if (isEnemyDonate) newFirstAtkPlayer = getSwitchedPlayerSign(sign.value);
  } else {
    if (isEnemyDonate) newFirstAtkPlayer = getSwitchedPlayerSign(sign.value);
    if (donate.value) newFirstAtkPlayer = sign.value;
  }
  if (newFirstAtkPlayer !== undefined) firstAtkPlayer.value = newFirstAtkPlayer;
  console.log(i, "donateの値がtrueの場合､優先度は最上位になる");
}
//指定された､fieldの値を比較する
async function compareSumField(field: "hungry" | "priority"): Promise<void> {
  console.log(s, "compareSum", field, "を実行しました");
  const { player, sign } = storeToRefs(playerStore);
  const { idEnemy, sumFields } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  const getSwitchedPlayerSign = (playerSign: PlayerSign): PlayerSign => (playerSign === 0 ? 1 : 0);
  let enemySumFields = (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumFields as SumCards;
  console.log(i, "sum", field, ": ", sumFields.value[field]);
  console.log(i, "enemySum", field, ": ", enemySumFields?.[field]);
  //hungryの値が小さい方が先行//hungryの値が同じならばFirstAtkPlayerの値を変更しない
  if (sumFields.value[field] < (enemySumFields?.[field] ?? 0)) {
    if (field === "hungry") firstAtkPlayer.value = sign.value;
    else if (field === "priority") firstAtkPlayer.value = getSwitchedPlayerSign(sign.value);
    console.log(i, field, "の値が小さいので", firstAtkPlayer.value, "が先行");
  } else if (sumFields.value[field] > (enemySumFields?.[field] ?? 0)) {
    if (field === "hungry") firstAtkPlayer.value = getSwitchedPlayerSign(sign.value);
    else if (field === "priority") firstAtkPlayer.value = sign.value;
    console.log(i, field, "の値が大きいので", firstAtkPlayer.value, "が先行");
  } else {
    console.log(i, field, "の値が同じなので");
  }
}
//firstAtkPlayerの値の監視
async function watchFirstAtkPlayerField(): Promise<void> {
  console.log(s, "watchFirstAtkPlayerFieldを実行しました");
  const { player, sign } = storeToRefs(playerStore);
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
        //監視を解除する
        unsubscribe();
        console.log(i, "firstAtkPlayerの監視を解除しました");
      }
    });
  } else {
    //先行後攻を決める//0か1をランダムに生成
    firstAtkPlayer.value = Math.random() < 0.5 ? 0 : 1;
    console.log(i, "ランダムで決まったplayer: ", firstAtkPlayer.value);
    updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: firstAtkPlayer.value });
  }
}

//戦闘処理を統括する
export async function battle() {
  console.log(s, "battleを実行しました");
  const { id, player, log, components } = storeToRefs(playerStore);
  const { check } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  //checkの値がtrueになっていたら､行動済みとする
  check.value = false;
  updateDoc(doc(playersRef, id.value), { check: check.value });
  await wait(1500);
  getEnemyPlayer(); //!

  //先行後攻を決める
  await watchFirstAtkPlayerField();
  await wait(1000);
  await compareSumField("hungry");
  await compareSumField("priority");
  await judgeDonate();
  if (firstAtkPlayer.value === undefined) throw new Error("firstAtkPlayerの値がundefinedです");
  else console.log(i, "結果...firstAtkPlayer: ", firstAtkPlayer.value);
  log.value = "結果...firstAtkPlayer: " + firstAtkPlayer.value;

  components.value = "afterDecideFirstAtkPlayer";
  await wait(1000);
  getEnemyPlayer(); //!
  components.value = "primaryAtk";

  console.log(i, "先行の攻撃");
  await calcDamage("primary");
  await reflectStatus();
  await checkMission("primary");

  await wait(3000);
  getEnemyPlayer(); //!
  components.value = "secondAtk";

  console.log(i, "後攻の攻撃");
  await calcDamage("second");
  await reflectStatus();
  await checkMission("second");

  await wait(3000);
  getEnemyPlayer(); //!

  //戦後処理
  components.value = "afterBattle";
  await postBattle();
}
//戦闘後の処理
export async function postBattle(): Promise<void> {
  console.log(s, "postBattleを実行しました");
  const { checkRotten, deleteField } = playerStore;
  const { id, player, cardLock, sign, log } = storeToRefs(playerStore);
  const { check, idGame, isSelectedGift, hand, field, status } = toRefs(player.value);
  const { nextTurn } = gameStore;
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  //handの腐り値を減らす
  changeHandValue("waste", -1);
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
  //腐っているカードにする
  checkRotten();

  //supのカードの効果を発動する
  if (field.value.map((card) => card.attribute).includes("sup") && status.value.hungry < 200) {
    field.value.forEach((card) => {
      if(!card.description) return;
      if (card.id === 52) drawOneCard("atk");
      if (card.id === 53) drawOneCard("tech");
      if (card.id === 54) drawOneCard("def");
      if (card.id === 55) drawOneCard("sup");
      if (card.id === 61) draw3ExchangedCard();
    });
  }

  //満腹値を減らす
  changeStatusValue("hungry", -30);
  //使ったカードを捨てる
  deleteField();
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

  getEnemyPlayer(); //!
  //shopを開く
  startShop();
}
//!export5日まとめる
