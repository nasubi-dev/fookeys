import { toRefs } from "vue";
import { e, i, s } from "@/log";
import { enemyPlayerStore, gameStore, playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, deleteField, doc, getDoc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import type { GameData, PlayerData, PlayerSign, Status, SumCards, Card } from "@/types";
import { converter } from "@/server/converter";
import { intervalForEach, wait, XOR } from "@/server/utils";
import { getEnemyPlayer } from "@/server/usePlayerData";
import { changeHandValue, changeStatusValue, draw3ExchangedCard, drawRandomOneCard } from "@/server/useShopUtils";
import { startShop } from "./useShop";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());

//Playerを同期する
async function syncPlayer(which: "primary" | "second"): Promise<{ myId: string; enemyId: string; my: PlayerData; enemy: PlayerData }> {
  const { id, player, sign } = storeToRefs(playerStore);
  const { idEnemy } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  //自分と相手のidを取得する
  let myId, enemyId;
  const playerAllocation = firstAtkPlayer.value === sign.value ? 1 : 0;
  if (playerAllocation) {
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
  const { status, sumFields, check, death } = toRefs(player.value);
  //ダメージを反映する
  let myPlayerStatus = (await getDoc(doc(playersRef, id.value))).data()?.status as Status;
  let myPlayerSumFields = (await getDoc(doc(playersRef, id.value))).data()?.sumFields as SumCards;
  let myPlayerCheck = (await getDoc(doc(playersRef, id.value))).data()?.check as boolean;
  let myPlayerDeath = (await getDoc(doc(playersRef, id.value))).data()?.death as boolean;
  if (!myPlayerStatus) throw Error("myStatusが取得できませんでした");
  if (!myPlayerSumFields) throw Error("mySumFieldsが取得できませんでした");
  if (myPlayerCheck === undefined) throw Error("myCheckが取得できませんでした");
  if (myPlayerDeath === undefined) throw Error("myDeathが取得できませんでした");
  status.value = myPlayerStatus;
  sumFields.value = myPlayerSumFields;
  check.value = myPlayerCheck;
  death.value = myPlayerDeath;
}
//死亡判定
async function checkDeath(p: PlayerData): Promise<boolean> {
  console.log(s, "checkDeathを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { idEnemy } = toRefs(player.value);

  if (p.status.hp <= 0) {
    updateDoc(doc(playersRef, id.value), { death: true });
    updateDoc(doc(playersRef, idEnemy.value), { death: true });
    return false;
  }
  return true;
}
//情報更新処理//!paramsはないだろ
async function everyUtil(params: [string, number]): Promise<void> {
  const { battleResult } = storeToRefs(playerStore);

  await wait(1000);
  await reflectStatus();
  await getEnemyPlayer(); //!
  battleResult.value = params;
  await wait(2000);
}
//ダメージを計算する
async function calcDamage(which: "primary" | "second"): Promise<boolean> {
  console.log(s, "calcDamageを実行しました");
  const { sign, battleResult, log, myLog, enemyLog } = storeToRefs(playerStore);
  const { game } = toRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);
  const { myId, enemyId, my, enemy } = await syncPlayer(which);
  const playerAllocation = firstAtkPlayer.value === sign.value ? 1 : 0;
  const attackOrder = XOR(playerAllocation === 0, which === "primary");

  //fieldが空の場合､ダメージ計算を行わない
  if (my.field.length === 0) return false;
  //寄付をしていた場合､ダメージ計算を行わない
  if (my.donate) {
    my.status.contribution += my.field.length * 5;
    if (playerAllocation) updateDoc(doc(playersRef, myId), { "status.contribution": my.status.contribution });
    await everyUtil(["donate", my.field.length * 5]);
    battleResult.value = ["none", 0];
    return false;
  }

  //自分がこのターン､行動不能の場合､ダメージ計算を行わない
  my.status.hungry += my.sumFields.hungry;
  if (playerAllocation) updateDoc(doc(playersRef, myId), { "status.hungry": my.status.hungry });
  if (my.status.hungry > my.status.maxHungry) {
    my.check = false;
    updateDoc(doc(playersRef, myId), { check: my.check });
    //hungryの値が上限を超えていた場合､上限値にする
    if (my.status.hungry > my.status.maxHungry) my.status.hungry = my.status.maxHungry;
    await everyUtil(["hungry", 1]); //?行動不能
    battleResult.value = ["none", 0];
    return false;
  }

  //相手がこのターン､行動不能の場合､ダメージ計算を行わない
  let enemySumHungry = enemy.status.hungry;
  if (enemySumHungry > enemy.status.maxHungry) {
    enemy.check = false;
    //hungryの値が上限を超えていた場合､上限値にする
    if (enemySumHungry > enemy.status.maxHungry) enemySumHungry = enemy.status.maxHungry;
  }

  //支援を行う
  if (my.field.map((card) => card.attribute).includes("sup")) {
    intervalForEach(
      (card: Card) => {
        if (!(card.id === 57 || card.id === 58 || card.id === 59 || card.id === 63 || card.id === 64 || card.id === 66)) return;
        if (!attackOrder) {
          enemyLog.value = card.name + "の効果!" + card.description;
          return;
        }
        myLog.value = card.name + "の効果!" + card.description;
        if (card.id === 58) changeHandValue("atk", 10, "atk");
        if (card.id === 59) changeHandValue("def", 20, "def");
        if (card.id === 64) changeStatusValue("maxHungry", 20, true);
      },
      my.field,
      100
    );
    await reflectStatus();

    await everyUtil(["sup", 0]);
  }

  //回復を行う
  if (my.field.map((card) => card.attribute).includes("heal")) {
    my.status.hp += my.sumFields.heal;
    if (my.status.hp > my.status.maxHp) my.status.hp = my.status.maxHp;
    intervalForEach(
      (card: Card) => {
        if (!(card.id === 60 || card.id === 62 || card.id === 65)) return;
        if (!attackOrder) {
          enemyLog.value = card.name + "の効果!" + card.description;
          return;
        }
        myLog.value = card.name + "の効果!" + card.description;
      },
      my.field,
      100
    );

    if (playerAllocation) updateDoc(doc(playersRef, myId), { "status.hp": my.status.hp });
    await everyUtil(["heal", my.sumFields.heal]);
  }

  //敵の防御力を計算する
  let defense = 0;
  if (enemy.field.map((card) => card.attribute).includes("def")) {
    if (which === "primary") console.log(i, "先行なので防御できない");
    else if (enemy.check) console.log(i, "敵は行動不能なので防御できない");
    else defense = enemy.sumFields.def;
  }

  //自分の防御を行う//?エフェクトのみ
  if (my.field.map((card) => card.attribute).includes("def")) {
    console.log(i, "防御!!!");
    //特殊効果を発動する
    intervalForEach(
      (card: Card) => {
        if (!(card.id === 45 || card.id === 48 || card.id === 56)) return;
        if (!attackOrder) {
          enemyLog.value = card.name + "の効果!" + card.description;
          return;
        }
        if (card.id === 45 || card.id === 48) changeStatusValue("hungry", -card.hungry);
        if (card.id === 56) {
          my.sumFields.def += my.status.hungry;
          updateDoc(doc(playersRef, myId), { "sumFields.def": my.sumFields.def });
        }
      },
      my.field,
      100
    );
    await reflectStatus();

    await everyUtil(["def", my.sumFields.def]);
  }

  //マッスル攻撃を行う
  if (my.field.map((card) => card.attribute).includes("atk")) {
    console.log(i, "マッスル攻撃!!!");
    //特殊効果を発動する
    intervalForEach(
      (card: Card) => {
        if (!(card.id === 10 || card.id === 50)) return;
        if (!attackOrder) enemyLog.value = card.name + "の効果!" + card.description;
        else myLog.value = card.name + "の効果!" + card.description;
        if (card.id === 10) defense = 0;
        if (card.id === 50 && which === "second") my.sumFields.atk += 75;
      },
      my.field,
      100
    );
    await reflectStatus();

    let holdingAtk = my.sumFields.atk - defense;
    if (holdingAtk < 0) holdingAtk = 0;
    console.log(i, "mySumFields.atk: ", my.sumFields.atk);
    enemy.status.hp -= holdingAtk;
    if (enemy.status.hp < 0) enemy.status.hp = 0;
    if (defense !== 0) console.log(i, "相手のdefが", enemy.sumFields.def, "なので", holdingAtk, "のダメージ");
    else console.log(i, "マッスル攻撃でenemyに", holdingAtk, "のダメージ");

    if (playerAllocation) updateDoc(doc(playersRef, enemyId), { "status.hp": enemy.status.hp });
    await everyUtil(["atk", my.sumFields.atk]);
    //死亡判定
    const isEnemyDeath = await checkDeath(enemy);
    const isMyDeath = await checkDeath(my);
    if (!isEnemyDeath || !isMyDeath) {
      battleResult.value = ["none", 0];
      return true;
    }
  }

  //テクニック攻撃を行う
  if (my.field.map((card) => card.attribute).includes("tech")) {
    console.log(i, "テクニック攻撃!!!");
    battleResult.value = ["none", 0]; //DamageAnimationのための処理
    //特殊効果を発動する
    intervalForEach(
      (card: Card) => {
        if (!(card.id === 17 || card.id === 20 || card.id === 26 || card.id === 29 || card.id === 31)) return;
        if (!attackOrder) {
          enemyLog.value = card.name + "の効果!" + card.description;
          return;
        }
        myLog.value = card.name + "の効果!" + card.description;
        if (card.id === 17 || card.id === 20) changeStatusValue("contribution", 5);
        if (card.id === 26) changeStatusValue("contribution", 20);
        if ((card.id === 29 || card.id === 31) && enemy.status.hungry >= 100) {
          my.sumFields.tech += 30;
          updateDoc(doc(playersRef, myId), { "sumFields.tech": my.sumFields.tech });
        }
      },
      my.field,
      100
    );
    await reflectStatus();

    let holdingTech = my.sumFields.tech;
    enemy.status.hp -= holdingTech;
    console.log(i, "mySumFields.tech: ", my.sumFields.tech);
    if (enemy.status.hp < 0) enemy.status.hp = 0;
    console.log(i, "テクニック攻撃でenemyに", holdingTech, "のダメージ");

    if (playerAllocation) updateDoc(doc(playersRef, enemyId), { "status.hp": enemy.status.hp });
    await everyUtil(["tech", holdingTech]);
    //死亡判定
    const isEnemyDeath = await checkDeath(enemy);
    const isMyDeath = await checkDeath(my);
    if (!isEnemyDeath || !isMyDeath) {
      battleResult.value = ["none", 0];
      return true;
    }
  }

  battleResult.value = ["none", 0];
  return false;
}

//missionの統括
async function checkMission(which: "primary" | "second"): Promise<void> {
  console.log(s, "checkMissionを実行しました");
  const { id, player, sign, myLog, enemyLog } = storeToRefs(playerStore);
  const { status } = toRefs(player.value);
  const { game, missions } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);
  const { my, enemy } = await syncPlayer(which);
  const playerAllocation = sign.value === firstAtkPlayer.value;

  if (my.check) return;

  //missionを進捗させる
  for (let mission of missions.value ?? []) {
    if (mission.achieved) continue;
    //Missionを進捗させる
    mission.nowAchievement += mission.checker?.(my.donate, my.sumFields, my.field, my.hand) ?? 0;
    //Missionを達成したら報酬を受け取る
    if (mission.nowAchievement >= mission.goalAchievement) {
      mission.achieved = true;
      mission.nowAchievement = mission.goalAchievement;
      if ((playerAllocation && which === "primary") || (!playerAllocation && which === "second")) {
        status.value.contribution += mission.reward;
        myLog.value = "mission: " + mission.name + "を達成したので" + mission.reward + "の貢献度を受け取りました";
      } else {
        enemyLog.value = "mission: " + mission.name + "を達成したので" + mission.reward + "の貢献度を受け取りました";
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
async function battle() {
  console.log(s, "battleを実行しました");
  const { id, player, components } = storeToRefs(playerStore);
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

  components.value = "afterDecideFirstAtkPlayer";
  await wait(1000);
  getEnemyPlayer(); //!
  components.value = "primaryAtk";

  console.log(i, "先行の攻撃");
  const isPrimaryDeath = await calcDamage("primary");
  await reflectStatus();
  if (isPrimaryDeath) return;
  await checkMission("primary");

  getEnemyPlayer(); //!
  await wait(1000);
  components.value = "secondAtk";

  console.log(i, "後攻の攻撃");
  const isSecondDeath = await calcDamage("second");
  await reflectStatus();
  if (isSecondDeath) return;
  await checkMission("second");

  getEnemyPlayer(); //!
  await wait(1000);
  components.value = "postBattle";

  //戦後処理
  await postBattle();
}
//戦闘後の処理
async function postBattle(): Promise<void> {
  console.log(s, "postBattleを実行しました");
  const { checkRotten, deleteField, decMaxHungry } = playerStore;
  const { id, player, sign, log, myLog, enemyLog } = storeToRefs(playerStore);
  const { check, idGame, isSelectedGift, hand, field, status, donate } = toRefs(player.value);
  const { enemyPlayer } = storeToRefs(enemyPlayerStore);
  const { field: enemyField, donate: enemyDonate, check: enemyCheck, hand: enemyHand } = toRefs(enemyPlayer.value);
  const { nextTurn } = gameStore;
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);
  const judgeDrawCard = (card: Card): boolean => {
    if (
      !(
        card.id === 52 ||
        card.id === 53 ||
        card.id === 54 ||
        card.id === 55 ||
        card.id === 61 ||
        card.id === 7 ||
        card.id === 25 ||
        card.id === 42 ||
        card.id === 44
      )
    ) {
      return true;
    }
    return false;
  };

  //handの腐り値を減らす
  changeHandValue("waste", -1);
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
  //腐っているカードにする
  const oldHandNum = hand.value.filter((card) => card.id === 0).length;
  checkRotten();
  const newHandNum = hand.value.filter((card) => card.id === 0).length;
  if (newHandNum - oldHandNum !== 0) {
    log.value = newHandNum - oldHandNum + "枚のカードが腐ってしまった！";
    decMaxHungry(newHandNum - oldHandNum);
    updateDoc(doc(playersRef, id.value), { hand: hand.value });
    updateDoc(doc(playersRef, id.value), { status: status.value });
  }

  //特殊効果用
  let defense = 0;
  let sumAtk = enemyField.value.map((card) => card.attribute).includes("atk")
    ? enemyField.value
        .map((card) => card.atk)
        .reduce((acc, cur) => {
          if (acc && cur) cur += acc;
          return cur;
        }, 0)
    : 0;
  if (sign.value !== firstAtkPlayer.value) sumAtk = 0;
  let sumDef = field.value.map((card) => card.attribute).includes("def")
    ? field.value
        .map((card) => card.def)
        .reduce((acc, cur) => {
          if (acc && cur) cur += acc;
          return cur;
        }, 0)
    : 0;
  if (sumAtk !== undefined && sumDef !== undefined) defense = sumDef - sumAtk;
  if (defense < 0) defense = 0;

  //このターン使用したカードの効果を発動する
  if (!enemyCheck.value && !enemyDonate.value) {
    enemyField.value.forEach((card: Card) => {
      if (judgeDrawCard(card)) return;
      enemyLog.value = card.name + "の効果!" + card.description;
    });
  }
  if (!check.value && !donate.value) {
    field.value.forEach((card: Card) => {
      if (judgeDrawCard(card)) return;
      myLog.value = card.name + "の効果!" + card.description;
      if (card.id === 52) drawRandomOneCard("atk");
      if (card.id === 53) drawRandomOneCard("tech");
      if (card.id === 54) drawRandomOneCard("def");
      if (card.id === 55) drawRandomOneCard("sup");
      if (card.id === 61) draw3ExchangedCard();
      if (card.id === 7 || card.id === 25 || card.id === 42) status.value.hungry >= 100 ? (status.value.hungry -= 20) : null; //?card.hungryだけ減らすでもいいかも
      if (card.id === 44) changeHandValue("def", defense, "def");
    });
  }
  //手札にあるカードの効果を発動する
  hand.value.forEach((card: Card) => {
    if (!(card.id === 6)) return;
    myLog.value = card.name + "の効果!" + card.description;
    changeHandValue("hungry", -10);
  });

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
  //defenseの値を0にする
  defense = 0;
  //isSelectedGiftの値をundefinedにする
  isSelectedGift.value = undefined;
  //firstAtkPlayerの値をundefinedにする
  firstAtkPlayer.value = undefined;

  getEnemyPlayer(); //!
  //shopを開く
  startShop();
}
export { battle };
