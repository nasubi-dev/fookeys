import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { i } from "@/log";
import type { Card, GameData, PlayerData, SumCards, Phase, PlayerSign } from "@/types";

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
    gifts: [0, 3, 9],
    isSelectedGift: undefined,
    hand: [],
    field: [],
    status: {
      hp: 600,
      hungry: 0,
      contribution: 0,
    },
    sumFields: {
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
  //?Computed/Getter
  //Fieldに出ているカードの値を合計する
  const sumCards = computed<SumCards>(() =>
    player.value.field.reduce(
      (sum: SumCards, card: Card) => {
        sum.waste += card.waste;
        sum.hungry += card.hungry;
        sum.priority += card.priority ?? 0;
        sum.atk += card.atk ?? 0;
        sum.def += card.def ?? 0;
        sum.tech += card.tech ?? 0;
        sum.heal += card.heal ?? 0;
        return sum;
      },
      { waste: 0, hungry: 0, priority: 0, atk: 0, def: 0, tech: 0, heal: 0 }
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
    sumCards,
    pushHand,
    popHand,
    deleteField,
    reduceWaste,
    shiftBattle,
  };
});

const useGameStore = defineStore("gameData", () => {
  //?Const/State
  const game = ref<GameData>({
    turn: 1,
    players: [],
    firstAtkPlayer: undefined,
    missions: [],
  });
  //?Computed/Getter
  ///?function/actions
  //ターン終了時に、turnを1増やす
  const nextTurn = (): void => {
    game.value.turn += 1;
    console.log(i, "turn: ", game.value.turn);
  };

  return { game, nextTurn };
});

export { useGameStore, usePlayerStore };
