import { toRefs } from "vue";
import { e, s, i } from "@/log";
import type { Card, GameData, PlayerData } from "@/types";
import { gameStore, playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, deleteField, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import { setMissions, setHand, setOffer } from "@/server/useShopUtils";
import { battle } from "@/server/useBattle";
import allMissions from "@/assets/allMissions";
import allCards from "@/assets/allCards";
import allGifts from "@/assets/allGifts";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());

//相手のisSelectedGiftを取得する
export async function getEnemyGift(): Promise<number | undefined> {
  console.log(i, "getEnemyGiftを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { idEnemy } = toRefs(player.value);

  const enemyGift = (await getDoc(doc(playersRef, idEnemy.value))).data()?.isSelectedGift;
  return enemyGift;
}

//shopフェーズの開始
export async function startShop(): Promise<void> {
  console.log(i, "startShopを実行しました");
  const { phase } = storeToRefs(playerStore);
  const { game } = storeToRefs(gameStore);

  phase.value = "shop";
  console.log(i, "phase: ", phase.value);
  if (game.value.turn % 4 == 1) setMissions();
  if (game.value.turn === 1) setHand();
  else setOffer();
}
//shopフェーズの終了
export async function endShop(): Promise<void> {
  console.log(i, "endShopを実行しました");
  const { id, player, phase, log } = storeToRefs(playerStore);
  const { isSelectedGift, idEnemy, status } = toRefs(player.value);

  //自分のisSelectedGiftを実行する
  const myGift = isSelectedGift.value;
  console.log(i, "myGift: ", myGift);
  if (myGift !== undefined) {
    console.log(i, "【戦闘前】自分のGiftを実行します");
    log.value = "【戦闘前】自分のGiftを実行します";
    console.log(i, "myGift: ", allGifts[myGift].name);
    allGifts[myGift].skill("before", id.value);
    status.value.contribution -= allGifts[myGift].requireContribution;
    log.value = allGifts[myGift].name + "を使用しました";
  }
  //敵のisSelectedGiftを実行する
  const enemyGift = (await getDoc(doc(playersRef, idEnemy.value))).data()?.isSelectedGift;
  console.log(i, "enemyGift: ", enemyGift);
  if (enemyGift !== undefined) {
    console.log(i, "【戦闘前】相手のGiftを実行します");
    log.value = "【戦闘前】相手のGiftを実行します";
    console.log(i, "enemyGift: ", allGifts[enemyGift].name);
    log.value = allGifts[enemyGift].name + "を使用しました";
    //Logだけ
  }

  //終了時処理
  phase.value = "battle";
  resetCheck();
}
//checkのReset
export function resetCheck() {
  console.log(i, "resetCheckを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { check } = toRefs(player.value);

  check.value = false;
  updateDoc(doc(playersRef, id.value), { check: check.value });
  console.log(i, "check: " + check.value);
}
//checkの値の監視
export async function watchShopEnd(): Promise<void> {
  console.log(i, "watchShopEndを実行しました");
  const { id, player, log } = storeToRefs(playerStore);
  const { check, idEnemy, isSelectedGift } = toRefs(player.value);

  //選択したGiftをFirestoreに保存する
  updateDoc(doc(playersRef, id.value), { isSelectedGift: isSelectedGift.value });
  console.log(i, "isSelectedGift: " + isSelectedGift.value);
  log.value = "isSelectedGift: " + isSelectedGift.value;
  //checkの値がtrueになっていたら､shopフェーズを終了する
  check.value = true;
  updateDoc(doc(playersRef, id.value), { check: check.value });
  console.log(i, "check: " + check.value);
  const enemyCheck = (await getDoc(doc(playersRef, idEnemy.value))).data()?.check;
  if (enemyCheck) {
    endShop();
  } else {
    const unsubscribe = onSnapshot(doc(playersRef, idEnemy.value), (doc) => {
      const data = doc.data();
      if (!data) return;
      if (data.check) {
        endShop();
        //監視を解除する
        unsubscribe();
        console.log(i, "checkの監視を解除しました");
      }
    });
  }
}
//checkの値の監視
export async function watchTurnEnd(): Promise<void> {
  console.log(i, "watchTurnEndを実行しました");
  const { id, player, sumCards } = storeToRefs(playerStore);
  const { check, idEnemy, sumFields, donate, field } = toRefs(player.value);

  //checkの値がtrueになっていたら､カード選択終了
  check.value = true;
  updateDoc(doc(playersRef, id.value), { check: check.value });
  updateDoc(doc(playersRef, id.value), { donate: donate.value });
  console.log(i, "check: " + check.value);
  sumFields.value = sumCards.value;
  updateDoc(doc(playersRef, id.value), { field: field.value });
  updateDoc(doc(playersRef, id.value), { sumFields: sumFields.value });
  const enemyCheck = (await getDoc(doc(playersRef, idEnemy.value))).data()?.check;
  if (enemyCheck) {
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
