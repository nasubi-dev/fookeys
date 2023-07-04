import { toRefs } from "vue";
import { e, s, i } from "@/log";
import { gameStore, playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { db } from "./firebase";
import { collection, deleteField, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import { battle } from "./useBattle";
import type { Card, Mission, GameData, PlayerData } from "@/types";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());
const missionsRef = collection(db, "missions").withConverter(converter<Mission>());
const deckRef = collection(db, "deck").withConverter(converter<Card>());

//cardをランダムに1枚引く
async function drawCard(): Promise<Card> {
  // console.log(i, "drawCardを実行しました");
  const deck = (await getDocs(deckRef)).docs.map((doc) => doc.data());
  const selectCard = deck[Math.floor(Math.random() * deck.length)];
  return selectCard;
}
//cardをHandに6枚セットする
export async function setHand(): Promise<void> {
  console.log(i, "setHandを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { hand } = toRefs(player.value);

  for (let i = 0; i < 6; i++) {
    const card = await drawCard();
    hand.value.push(card);
    hand.value.sort((a, b) => a.id - b.id);
  }
  updateDoc(doc(playersRef, id.value), { hand: hand.value });
}
//Cardを3枚提示する
export async function setOffer(): Promise<void> {
  console.log(i, "setOfferを実行しました");
  const { offer } = storeToRefs(playerStore);

  for (let i = 0; i < 3; i++) {
    const card = await drawCard();
    offer.value.push(card);
    offer.value.sort((a, b) => a.id - b.id);
  }
}
//指定のcardを1枚引く
//missionを3つセットする
export async function setMissions(): Promise<void> {
  console.log(i, "setMissionsを実行しました");
  const { player } = storeToRefs(playerStore);
  const { idGame } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { missions } = toRefs(game.value);

  missions.value = [];
  await updateDoc(doc(gamesRef, idGame.value), { missions: deleteField() });
  console.log(i, "ミッションを削除しました");
  if (!playerStore.player.sign) {
    const allMissions = (await getDocs(missionsRef)).docs.map((doc) => doc.data());
    for (let i = 0; i < 3; i++) {
      const selectMission = allMissions[Math.floor(Math.random() * allMissions.length)];
      missions.value.push(selectMission);
      //選ばれたミッションはmissionsから削除する
      allMissions.splice(allMissions.indexOf(selectMission), 1);
    }
    updateDoc(doc(gamesRef, idGame.value), { missions: missions.value });
    console.log(i, "missionsにミッションを追加しました");
  } else {
    console.log(i, "ミッションを監視します");
    const unsubscribe = onSnapshot(doc(gamesRef, idGame.value), (snap) => {
      if (snap.data()?.missions !== missions.value) {
        const mission = snap.data()?.missions;
        if (mission !== undefined) {
          missions.value.push(...mission);
          console.log(i, "missionsにミッションを追加しました");
          //監視を解除する
          unsubscribe();
          console.log(i, "missionsの監視を解除しました");
        }
      }
    });
  }
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

//checkの値の監視
export async function watchTurnEnd(): Promise<void> {
  console.log(i, "watchTurnEndを実行しました");
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
