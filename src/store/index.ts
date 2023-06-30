import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { i } from "@/log";
import type { Card, GameData, PlayerData, SumCards, Mission } from "@/types";

const usePlayerStore = defineStore("playerData", () => {
  //?Const/State
  const id = ref("");
  const player = ref<PlayerData>({
    idEnemy: "",
    idGame: "",
    name: "",
    match: "nothing",
    check: false,
    sign: 0,
    character: {
      name: "",
      description: "",
      company: "",
    },
    gift: [],
    hand: [],
    field: [],
    status: {
      hp: 1000,
      hungry: 0,
      contribution: 0,
    },
    sumFields: {
      waste: 0,
      hungry: 0,
      priority: 0,
      pow: 0,
      def: 0,
      tech: 0,
    },
  });
  const isSelected = ref<boolean[]>([false, false, false, false, false, false, false, false, false]);
  const cardLock = ref(false);
  //?Computed/Getter
  //Fieldに出ているカードの値を合計する
  const sumCards = computed<SumCards>(() =>
    player.value.field.reduce(
      (sum: SumCards, card: Card) => {
        sum.waste += card.waste;
        sum.hungry += card.hungry;
        sum.priority += card.priority ?? 0;
        sum.pow += card.pow ?? 0;
        sum.def += card.def ?? 0;
        sum.tech += card.tech ?? 0;
        return sum;
      },
      { waste: 0, hungry: 0, priority: 0, pow: 0, def: 0, tech: 0 }
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
  //ターン終了時に、isSelectedがtrueのカードを捨てる
  const deleteHand = (): void => {
    const { hand } = player.value;
    const deleteIndex = isSelected.value.reduce((acc: number[], bool, index) => {
      if (bool) acc.unshift(index);
      return acc;
    }, []);
    deleteIndex.forEach((index) => {
      hand.splice(index, 1);
      isSelected.value[index] = false;
    });
    console.log(
      i,
      "deleteHand: ",
      "hand: ",
      hand.map((card) => card.name)
    );
  };
  //ターン終了時に､Handのカードの腐り値を減らす(0になったら腐りカードにする)
  const reduceWaste = (): void => {
    const { hand } = player.value;
    hand.forEach((card) => {
      card.waste -= 1;
      if (card.waste > 0) return;
      hand.splice(hand.indexOf(card), 1, { ...card, rotten: true });
    });
  };
  return {
    id,
    player,
    isSelected,
    cardLock,
    sumCards,
    pushHand,
    popHand,
    deleteField,
    deleteHand,
    reduceWaste,
  };
});

const useGameStore = defineStore("gameData", () => {
  //?Const/State
  const game = ref<GameData>({
    turn: 1,
    players: [],
    missions: [],
    firstAtkPlayer: undefined,
  });
  //?Computed/Getter
  ///?function/actions
  //ターン終了時に、turnを1増やす
  const nextTurn = (): void => {
    game.value.turn += 1;
    console.log(i, "turn: ", game.value.turn);
  };
  //missionを4ターンに一回更新する
  const updateMission = (newMissions: Mission[]): void => {
    game.value.missions = newMissions;
    console.log(i, "mission: ", game.value.missions);
  };

  return { game, nextTurn, updateMission };
});

export { useGameStore, usePlayerStore };
