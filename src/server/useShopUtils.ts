import { toRefs } from "vue";
import { e, s, i } from "@/log";
import { gameStore, playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, deleteField, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import type { Card, GameData, PlayerData } from "@/types";
import allCharacters from "@/assets/allCharacters";
import allMissions from "@/assets/allMissions";
import allCards from "@/assets/allCards";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());

//cardをランダムに1枚引く
export function drawCard(): Card {
  // console.log(i, "drawCardを実行しました");
  const selectCard = allCards[Math.floor(Math.random() * allCards.length)];
  return selectCard;
}
//cardをHandに6枚セットする
export async function setHand(): Promise<void> {
  console.log(i, "setHandを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  for (let i = 0; i < 6; i++) {
    hand.value.push(drawCard());
    if (hand.value.length > 9) hand.value.shift();
    hand.value.sort((a, b) => a.id - b.id);
  }
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
  console.log(i, "setHand: ", hand.value);
}
//Cardを3枚提示する
export async function setOffer(): Promise<void> {
  console.log(i, "setOfferを実行しました");
  const { offer } = storeToRefs(playerStore);

  for (let i = 0; i < 3; i++) {
    offer.value.push(drawCard());
    offer.value.sort((a, b) => a.id - b.id);
  }
}
//Handをすべて入れ替える
export async function changeAllHand(): Promise<void> {
  console.log(i, "changeAllHandを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  const num = hand.value.length;
  hand.value = [];
  for (let i = 0; i < num; i++) {
    hand.value.push(drawCard());
  }
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
  console.log(i, "changeAllHand: ", hand.value);
}
//指定のcardを1枚引く
//missionを3つセットする
export async function setMissions(): Promise<void> {
  console.log(i, "setMissionsを実行しました");
  const { player, sign } = storeToRefs(playerStore);
  const { idGame } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { missions } = toRefs(game.value);

  if (!sign.value) {
    for (let i = 0; i < 3; i++) {
      const selectMissions = allMissions[Math.floor(Math.random() * allMissions.length)];
      missions.value[i] = selectMissions.id;
      //同じmissionがセットされないようにする
      for (let j = 0; j < i; j++) {
        if (missions.value[i] === missions.value[j]) {
          i--;
          missions.value.pop();
          break;
        }
      }
    }
    updateDoc(doc(gamesRef, idGame.value), { missions: missions.value });
    console.log(i, "missionにミッションを追加しました");
    console.log(i, "missions: ", missions.value);
    updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: deleteField() });
  } else {
    console.log(i, "ミッションを監視します");
    const unsubscribe = onSnapshot(doc(gamesRef, idGame.value), (snap) => {
      const updateMissions = snap.data()?.missions;
      if (updateMissions?.length === 3) {
        missions.value = updateMissions;
        console.log(i, "missionsにミッションを追加しました");
        console.log(i, "missions: ", missions.value);
        //監視を解除する
        unsubscribe();
        console.log(i, "missionsの監視を解除しました");
      }
    });
  }
}
//Handの値を変更する
export function changeHandValue(key: "hungry" | "waste", value: number): void {
  console.log(i, "changeHandValueを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  hand.value.forEach((card) => {
    card[key] += value;
    if (card[key] < 0) card[key] = 0;
  });
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
  console.log(
    i,
    "changeHandValue: ",
    key,
    hand.value.map((card) => card[key])
  );
}
//Handの腐ったカードを削除する
export function deleteAllWaste0(): void {
  console.log(i, "reduceWaste0を実行しました");
  const { deleteAllWaste0 } = playerStore;
  const { id, player } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  deleteAllWaste0();
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
}
//Statusの値を変更する
export function changeStatusValue(key: "contribution" | "hp" | "hungry", value: number): void {
  console.log(i, "changeStatusValueを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { status, character } = toRefs(player.value);

  status.value[key] += value;
  const maxHp = 600 + (allCharacters[character.value].maxHp ?? 0);
  if (key === "hp" && status.value.hp > maxHp) status.value.hp = maxHp;
  if (key === "hungry" && status.value.hungry < 0) status.value.hungry = 0;
  updateDoc(doc(playersRef, id.value), { status: status.value });
  console.log(i, "changeStatusValue: ", key, status.value[key]);
}
