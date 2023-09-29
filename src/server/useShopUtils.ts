import { toRefs } from "vue";
import * as _ from "lodash";
import { e, s, i } from "@/log";
import { gameStore, playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, deleteField, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import type { Card, GameData, PlayerData, Attribute } from "@/types";
import allCharacters from "@/assets/allCharacters";
import allMissions from "@/assets/allMissions";
import allCards from "@/assets/allCards";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());

//cardをランダムに1枚引く
export function drawCard(attribute?: Attribute): Card {
  if (attribute) {
    const attributeCards = allCards.filter((card) => {
      if (attribute === "atk") card.id <= 16;
      if (attribute === "def") card.id >= 17 && card.id <= 32;
      if (attribute === "tech") card.id >= 33 && card.id <= 49;
      if (attribute === "sup") card.id >= 50;
    });
    const selectCard = _.cloneDeep(attributeCards[Math.floor(Math.random() * attributeCards.length)]);
    return selectCard;
  } else {
    const selectCard = _.cloneDeep(allCards[Math.floor(Math.random() * allCards.length)]);
    return selectCard;
  }
}
//cardをランダムに1枚引く
export function drawOneCard(attribute: Attribute): void {
  const { player } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);
  hand.value = [...hand.value, drawCard(attribute)];
}
//cardをHandに6枚セットする
export async function setHand(): Promise<void> {
  console.log(i, "setHandを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  for (let i = 0; i < 6; i++) {
    if (hand.value.length >= 9) {
      console.log(i, "hand is full");
      return;
    } else {
      hand.value.push(drawCard());
    }
    if (hand.value.length > 9) hand.value.shift();
    hand.value = [...hand.value].sort((a, b) => a.id - b.id);
  }
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
}
//Cardを3枚提示する
export async function setOffer(): Promise<void> {
  console.log(i, "setOfferを実行しました");
  const { offer } = storeToRefs(playerStore);

  offer.value = [];
  for (let i = 0; i < 3; i++) {
    offer.value.push(drawCard());
    offer.value = [...offer.value].sort((a, b) => a.id - b.id);
  }
}
//Handをすべて入れ替える
export async function changeAllHand(): Promise<void> {
  console.log(i, "changeAllHandを実行しました");
  const { id, player, log } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  const num = hand.value.length;
  hand.value = [];
  for (let i = 0; i < num; i++) {
    hand.value.push(drawCard());
  }
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
  console.log(
    i,
    "changeAllHand: ",
    hand.value.map((card) => card.name)
  );
  log.value = "changeAllHand: " + hand.value.map((card) => card.name);
}
//指定のcardを1枚引く
//missionを3つセットする
export async function setMissions(): Promise<void> {
  console.log(i, "setMissionsを実行しました");
  const { player, sign, log } = storeToRefs(playerStore);
  const { idGame } = toRefs(player.value);
  const { game, missions } = storeToRefs(gameStore);
  const { missionsNum } = toRefs(game.value);

  if (!sign.value) {
    for (let i = 0; i < 3; i++) {
      const selectMission = Math.floor(Math.random() * allMissions.length);
      missionsNum.value[i] = selectMission;
      //同じmissionがセットされないようにする
      for (let j = 0; j < i; j++) {
        if (allMissions[missionsNum.value[i]].id === allMissions[missionsNum.value[j]].id) {
          i--;
          missions.value?.pop();
          break;
        }
      }
    }
    updateDoc(doc(gamesRef, idGame.value), { missionsNum: missionsNum.value });
    missions.value = missionsNum.value.map((num) => allMissions[num]);
    console.log(i, "missionにミッションを追加しました");
    log.value = "missionにミッションを追加しました";
    console.log(
      i,
      "missions: ",
      allMissions[missionsNum.value[0]].name,
      allMissions[missionsNum.value[1]].name,
      allMissions[missionsNum.value[2]].name
    );
    updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: deleteField() });
  } else {
    console.log(i, "ミッションを監視します");
    const unsubscribe = onSnapshot(doc(gamesRef, idGame.value), (snap) => {
      const updateMissions = snap.data()?.missionsNum as number[] | undefined;
      if (updateMissions?.length === 3) {
        missionsNum.value = updateMissions;
        missions.value = missionsNum.value.map((num) => allMissions[num]);
        console.log(i, "missionsにミッションを追加しました");
        console.log(
          i,
          "missions: ",
          allMissions[missionsNum.value[0]].name,
          allMissions[missionsNum.value[1]].name,
          allMissions[missionsNum.value[2]].name
        );
        //監視を解除する
        unsubscribe();
        console.log(i, "missionsの監視を解除しました");
      }
    });
  }
}
//SumCardsの値を変更する
export function changeSumCardsValue(key: "waste" | "hungry" | "priority" | "atk" | "def" | "tech" | "heal", value: number): void {
  console.log(i, "changeSumCardsValueを実行しました");
  const { log, sumCards } = storeToRefs(playerStore);

  sumCards.value[key] += value;
  console.log(i, "changeSumCardsValue: ", key, sumCards.value[key]);
  log.value = "changeSumCardsValue: " + key + sumCards.value[key];
}
//Handの値を変更する
export function changeHandValue(key: "waste" | "hungry" | "priority" | "atk" | "def" | "tech" | "heal", value: number): void {
  console.log(i, "changeHandValueを実行しました");
  const { id, player, log } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  hand.value.forEach((card) => {
    if (card[key] === undefined) return;
    card[key] += value;
  });
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
  console.log(
    i,
    "changeHandValue: ",
    key,
    hand.value.map((card) => card[key])
  );
  log.value = "changeHandValue: " + key + hand.value.map((card) => card[key]);
}
//Handの腐ったカードを削除する
export function deleteAllRottenCard(): void {
  console.log(i, "reduceWaste0を実行しました");
  const { deleteAllWaste0 } = playerStore;
  const { id, player, log } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  deleteAllWaste0();
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
}
//Statusの値を変更する
export function changeStatusValue(key: "contribution" | "hp" | "hungry", value: number): void {
  console.log(i, "changeStatusValueを実行しました");
  const { id, player, log } = storeToRefs(playerStore);
  const { status, character } = toRefs(player.value);

  status.value[key] += value;
  const maxHp = 600 + (allCharacters[character.value].maxHp ?? 0);
  if (key === "hp" && status.value.hp > maxHp) status.value.hp = maxHp;
  if (key === "hungry" && status.value.hungry < 0) status.value.hungry = 0;
  updateDoc(doc(playersRef, id.value), { status: status.value });
  console.log(i, "changeStatusValue: ", key, status.value[key]);
  log.value = "changeStatusValue: " + key + status.value[key];
}
