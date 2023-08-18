import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { i } from "@/log";
import type { Card, GameData, PlayerData, SumCards, Phase, PlayerSign, Mission } from "@/types";

const usePlayerStore = defineStore("playerData", () => {
  //?Const/State
  const id = ref("");
  const sign = ref<PlayerSign>(0);
  const player = ref<PlayerData>({
    idEnemy: "",
    idGame: "",
    name: "",
    check: false,
    donate: false,
    match: "nothing",
    character: 0,
    gifts: [5, 3, 9],
    isSelectedGift: undefined,
    hand: [],
    field: [],
    status: {
      hp: 600,
      hungry: 0,
      contribution: 0,
    },
    sumFields: {
      num: 0,
      waste: 0,
      hungry: 0,
      priority: 0,
      atk: 0,
      def: 0,
      tech: 0,
      heal: 0,
    },
  });
  const phase = ref<Phase>("none");
  const cardLock = ref(false);
  const offer = ref<Card[]>([]);
  const log = ref<string>();
  const components = ref<string>("afterBattle");
  const battleResult = ref<(string | number)[]>(["none", 0]);
  //?Computed/Getter
  //Fieldに出ているカードの値を合計する
  const sumCards = computed<SumCards>(() =>
    player.value.field.reduce(
      (sum: SumCards, card: Card) => {
        sum.num += 1;
        sum.waste += card.waste;
        sum.hungry += card.hungry;
        sum.priority += card.priority ?? 0;
        sum.atk += card.atk ?? 0;
        sum.def += card.def ?? 0;
        sum.tech += card.tech ?? 0;
        sum.heal += card.heal ?? 0;
        return sum;
      },
      { num: 0, waste: 0, hungry: 0, priority: 0, atk: 0, def: 0, tech: 0, heal: 0 }
    )
  );
  //?function/actions
  //Handのカードをクリックしたら、そのカードをFieldに出す
  const pushHand = (index: number): void => {
    const { field, hand } = player.value;
    field.push(hand[index]);
    console.log(
      i,
      "pushHand: ",
      index,
      "field: ",
      field.map((card) => card.name)
    );
  };
  //Fieldのカードをクリックしたら、そのカードをHandに戻す
  const popHand = (index: number, id: number): void => {
    const { field } = player.value;
    const cardIndex = field.findIndex((card) => card.id === id);
    if (cardIndex === -1) throw new Error("when popHard not found");
    field.splice(cardIndex, 1);
    console.log(
      i,
      "popHand: ",
      index,
      "field: ",
      field.map((card) => card.name)
    );
  };
  //ターン終了時に、Fieldのカードを捨てる
  const deleteField = (): void => {
    const { field } = player.value;
    field.splice(0, field.length);
    console.log(i, "fieldDelete");
  };
  //ターン終了時に､Handのカードの腐り値を減らす(0になったら腐りカードにする)
  const reduceWaste = (): void => {
    const { hand } = player.value;
    hand.forEach((card) => {
      card.waste -= 1;
      if (card.waste > 0) return;
      hand.splice(hand.indexOf(card), 1, { ...card, rotten: true });
    });
    console.log(
      i,
      "reduceWaste: ",
      "hand: ",
      hand.map((card) => card.name)
    );
  };
  //腐っている全てのカードを削除する
  const deleteAllWaste0 = (): void => {
    const { hand } = player.value;
    //forEachの中でspliceを使うとindexがずれるので、whileを使う
    let i = 0;
    while (i < hand.length) {
      if (hand[i].waste === 0) hand.splice(i, 1);
      else i++;
    }
    console.log(
      i,
      "deleteAllWaste0: ",
      "hand: ",
      hand.map((card) => card.name)
    );
  };
  //PhaseをShopからBattleに変更する
  const shiftBattle = (): void => {
    phase.value = "battle";
    console.log(i, "changePhase: ", phase.value);
  };
  return {
    id,
    sign,
    player,
    phase,
    cardLock,
    offer,
    log,
    components,
    battleResult,
    sumCards,
    pushHand,
    popHand,
    deleteField,
    reduceWaste,
    deleteAllWaste0,
    shiftBattle,
  };
});

const useEnemyPlayerStore = defineStore("enemyPlayerData", () => {
  //?Const/State
  const enemyPlayer = ref<PlayerData>({
    idEnemy: "",
    idGame: "",
    name: "",
    check: false,
    donate: false,
    match: "nothing",
    character: 0,
    gifts: [5, 3, 9],
    isSelectedGift: undefined,
    hand: [],
    field: [],
    status: {
      hp: 600,
      hungry: 0,
      contribution: 0,
    },
    sumFields: {
      num: 0,
      waste: 0,
      hungry: 0,
      priority: 0,
      atk: 0,
      def: 0,
      tech: 0,
      heal: 0,
    },
  });
  return { enemyPlayer };
});

const useGameStore = defineStore("gameData", () => {
  //?Const/State
  const game = ref<GameData>({
    turn: 1,
    players: [],
    firstAtkPlayer: undefined,
    missionsNum: [],
  });
  const missions = ref<Mission[]>([]);
  //?Computed/Getter
  ///?function/actions
  //ターン終了時に、turnを1増やす
  const nextTurn = (): void => {
    game.value.turn += 1;
    console.log(i, "turn: ", game.value.turn);
  };

  return { game, missions, nextTurn };
});

export { useGameStore, useEnemyPlayerStore, usePlayerStore };
