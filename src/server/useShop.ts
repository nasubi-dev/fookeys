import { toRefs } from "vue";
import { collection, deleteField, doc, getDoc, getDocs, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { storeToRefs } from "pinia";
import { i, s } from "@/log";
import { converter } from "@/server/converter";
import { battle } from "./useBattle";
import type { Card, Mission, GameData, PlayerData } from "@/types";
import { gameStore, playerStore } from "@/main";

import { db } from "./firebase";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());
const missionsRef = collection(db, "missions").withConverter(converter<Mission>());
const deckRef = collection(db, "deck").withConverter(converter<Card>());

//cardをランダムに一枚引く
async function drawCard(): Promise<Card> {
  const deck = (await getDocs(deckRef)).docs.map((doc) => doc.data());
  const selectCard = deck[Math.floor(Math.random() * deck.length)];
  return selectCard;
}
//cardをHandに6枚セットする
export async function setHand(): Promise<void> {
  const { id, player } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  for (let i = 0; i < 6; i++) {
    const card = await drawCard();
    hand.value.push(card);
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
    const unsubscribe = onSnapshot(doc(gamesRef, idGame.value), (snap) => {
      const data = snap.data();
      if (data?.missions.length === 3) {
        missions.value = data?.missions;
        unsubscribe();
      }
    });
    return;
  }
  const allMissions = (await getDocs(missionsRef)).docs.map((doc) => doc.data());
  for (let i = 0; i < 3; i++) {
    const selectMission = allMissions[Math.floor(Math.random() * allMissions.length)];
    missions.value.push(selectMission);
    //選ばれたミッションはmissionsから削除する
    allMissions.splice(allMissions.indexOf(selectMission), 1);
    //Firestoreにmissionsを保存する
    //arrayUnionを使うと、配列に要素を追加できる(arrayRemoveで削除もできる)
  }
  await updateDoc(doc(gamesRef, idGame.value), { missions: missions.value });
}

//checkの値の監視
export async function watchTurnEnd(): Promise<void> {
  const { id, player, sumCards } = storeToRefs(playerStore);
  const { check, idEnemy, sumFields } = toRefs(player.value);

  //checkの値がtrueになっていたら､カード選択終了
  check.value = true;
  updateDoc(doc(playersRef, id.value), { check: check.value });
  console.log(i, "check: " + check.value);
  //FieldのカードをFirestoreに保存する
  sumFields.value = sumCards.value;
  updateDoc(doc(playersRef, id.value), { sumFields: sumFields.value });
  const enemyCheck = (await getDoc(doc(playersRef, idEnemy.value))).data()?.check;
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
