import { toRefs } from "vue";
import { e, s, i } from "@/log";
import type { PlayerData } from "@/types";
import { gameStore, playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import { wait } from "@/server/utils";
import { getEnemyPlayer } from "@/server/usePlayerData";
import { setMissions, setHand, setOffer } from "@/server/useShopUtils";
import { battle } from "@/server/useBattle";
import allGifts from "@/assets/allGifts";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());

//shopフェーズの開始
export async function startShop(): Promise<void> {
  console.log(i, "startShopを実行しました");
  const { phase } = storeToRefs(playerStore);
  const { game, missions } = storeToRefs(gameStore);

  phase.value = "shop";
  console.log(i, "phase: ", phase.value);
  if (game.value.turn % 4 == 1) {
    missions.value = undefined;
    setMissions();
  }
  if (game.value.turn === 1) {
    setHand();
    phase.value = "battle";
  } else setOffer();
}
//shopフェーズの終了
export async function endShop(): Promise<void> {
  console.log(i, "endShopを実行しました");
  const { id, player, phase, log, enemyLog, cardLock } = storeToRefs(playerStore);
  const { isSelectedGift, status, check, idEnemy, name } = toRefs(player.value);

  //自分のisSelectedGiftを実行する
  const myGift = isSelectedGift.value;
  if (myGift !== undefined) {
    allGifts[myGift].skill();
    status.value.contribution -= allGifts[myGift].requireContribution;
    log.value = allGifts[myGift].name + "を使用しました";
  }
  //相手のisSelectedGiftを実行する
  const enemyGift = (await getDoc(doc(playersRef, idEnemy.value))).data()?.isSelectedGift as number | undefined;
  if (enemyGift !== undefined) {
    console.log(i, "enemyGift: ", allGifts[enemyGift].name);
    //Logだけ
    enemyLog.value = allGifts[enemyGift].name + "を使用しました";
  }
  //終了時処理
  phase.value = "battle";
  check.value = false;
  //cardLockの値をfalseにする(初期値に戻す)
  cardLock.value = false;
  updateDoc(doc(playersRef, id.value), { check: check.value });
  console.log(i, "check: " + check.value);
  getEnemyPlayer(); //!
}
//checkの値の監視
export async function watchShopEnd(): Promise<void> {
  console.log(i, "watchShopEndを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { check, idEnemy, isSelectedGift, hand } = toRefs(player.value);

  //Firestoreに保存する
  updateDoc(doc(playersRef, id.value), { isSelectedGift: isSelectedGift.value });
  updateDoc(doc(playersRef, id.value), { hand: hand.value });

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
  const { check, idEnemy, sumFields, donate, field, hand } = toRefs(player.value);

  //checkの値がtrueになっていたら､カード選択終了
  check.value = true;
  sumFields.value = sumCards.value;
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
  updateDoc(doc(playersRef, id.value), { field: field.value });
  updateDoc(doc(playersRef, id.value), { check: check.value });
  updateDoc(doc(playersRef, id.value), { donate: donate.value });
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
