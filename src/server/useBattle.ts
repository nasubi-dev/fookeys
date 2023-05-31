import { h, toRefs } from "vue";
import { collection, deleteField, doc, getDoc, getDocs, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { storeToRefs } from "pinia";
import { i, s } from "@/log";
import { converter } from "@/server/converter";
import type { Card, Mission, GameData, PlayerData } from "@/types";
import { gameStore, playerStore } from "@/main";

import { db } from "./firebase";

//Collectionの参照
const playersRef = collection(db, "players").withConverter(converter<PlayerData>());
const gamesRef = collection(db, "games").withConverter(converter<GameData>());
const missionsRef = collection(db, "missions").withConverter(converter<Mission>());
const deckRef = collection(db, "deck").withConverter(converter<Card>());

//指定された､fieldの値を比較する
async function compareSumField(field: "hungry" | "priority"): Promise<void> {
  console.log(s, "compareSum", field, "を実行しました");
  const { player } = storeToRefs(playerStore);
  const { idEnemy, sumFields, sign } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  const enemySumField = (await getDoc(doc(playersRef, idEnemy.value))).data()?.sumFields[field] ?? 0;
  console.log(i, "sum", field, ": ", sumFields.value[field]);
  console.log(i, "enemySum", field, ": ", enemySumField);
  //hungryの値が小さい方が先行//hungryの値が同じならばFirstAtkPlayerの値を変更しない
  if (sumFields.value[field] < enemySumField) {
    firstAtkPlayer.value = sign.value;
    console.log(i, field, "の値が小さい", firstAtkPlayer.value, "が先行");
  } else if (sumFields.value[field] > enemySumField) {
    firstAtkPlayer.value = sign.value % 2 === 0 ? 1 : 0;
    console.log(i, field, "の値が小さい", firstAtkPlayer.value, "が先行");
  } else {
    console.log(i, field, "の値が同じなので");
  }
}
//処理の順番を決める
export async function decideFirstAtkPlayer(): Promise<void> {
  console.log(s, "decideFirstAtkPlayerを実行しました");
  const { game } = storeToRefs(gameStore);
  const { firstAtkPlayer } = toRefs(game.value);

  compareSumField("hungry");
  compareSumField("priority").then(() => {
    console.log(i, "結果...firstAtkPlayer: ", firstAtkPlayer.value);
  });
}
//firstAtkPlayerの値の監視
export function watchFirstAtkPlayerField() {
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
        //監視を解除する
        unsubscribe();
        console.log(i, "firstAtkPlayerの監視を解除しました");
        updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: deleteField() });
        decideFirstAtkPlayer();
      }
    });
  } else {
    //先行後攻を決める//0か1をランダムに生成
    firstAtkPlayer.value = Math.random() < 0.5 ? 0 : 1;
    console.log(i, "ランダムで決まったplayer: ", firstAtkPlayer.value);
    updateDoc(doc(gamesRef, idGame.value), { firstAtkPlayer: firstAtkPlayer.value });
    decideFirstAtkPlayer();
  }
}

//寄付ならば先に処理を行う
export async function donate(): Promise<void> {
  console.log(s, "donateを実行しました");
  playerStore.player.check = true;
  //TODO: 寄付の処理を書く
}
//ダメージを計算する
//ダメージをFirestoreに保存する
//その値が正しいか確認する

//戦闘処理を統括する
export async function battle(): Promise<void> {
  console.log(s, "battleを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { check, field, status } = toRefs(player.value);

  //checkの値がtrueになっていたら､行動済みとする
  check.value = false;
  await updateDoc(doc(playersRef, id.value), { check: check.value });
  //寄付ならば先に処理を行う
  //TODO: Fieldの最初のカードが寄付カードだったら、ここで寄付の処理を行う
  if (field.value[0].name === "foodBank") donate();
  //先行後攻を決める
  watchFirstAtkPlayerField();
  //攻撃を行う
  //hungryの値が上限を超えていた場合､行動不能にする(ダメージ計算のときに行動不能の判定を行えばいいかも)
  //ダメージを計算する
  //missionを達成しているか確認する
  //死亡判断を行う
}

//turnを進める
export async function nextTurn(): Promise<void> {
  console.log(s, "nextTurnを実行しました");
  const { id, player } = storeToRefs(playerStore);
  const { idGame, check } = toRefs(player.value);
  const { game } = storeToRefs(gameStore);

  game.value.turn++;
  check.value = false;
  //incrementを使うと、値を1増やすことができる
  updateDoc(doc(gamesRef, idGame.value), { turn: increment(1) });
  updateDoc(doc(playersRef, id.value), { check: check.value });
}

//!すべてのターン管理(最終的な形は未定)
export async function startGame(): Promise<void> {
  console.log(s, "startGameを実行しました");
}
//!export5日まとめる
