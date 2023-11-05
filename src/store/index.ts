import { computed, ref } from "vue";
import { i } from "@/log";
import { defineStore } from "pinia";
import type { Card, GameData, PlayerData, SumCards, Phase, PlayerSign, Mission } from "@/types";
import allCards from "@/assets/allCards";

const usePlayerStore = defineStore("playerData", () => {
  //?Const/State
  const id = ref("");
  const sign = ref<PlayerSign>(0);
  const player = ref<PlayerData>({
    idEnemy: "",
    idGame: "",
    name: "",
    check: false,
    death: false,
    donate: false,
    match: "nothing",
    character: "blankiss",
    gifts: [4, 5, 6],
    isSelectedGift: undefined,
    hand: [],
    field: [],
    status: {
      hp: 600,
      hungry: 0,
      contribution: 0,
      maxHp: 600,
      maxHungry: 200,
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
  const log = ref<string>("");
  const myLog = ref<string>("");
  const enemyLog = ref<string>("");
  const components = ref<string>("postBattle");
  const battleResult = ref<(string | number)[]>(["none", 0]);
  //?Computed/Getter
  //Fieldに出ているカードの値を合計する
  const sumCards = computed<SumCards>(
    () =>
      player.value.field.reduce(
        (sum: SumCards, card: Card) => {
          sum.waste += card.waste;
          sum.hungry += card.hungry;
          sum.priority += card.priority ?? 0;
          sum.atk +=
            (card.atk ?? 0) *
            (player.value.isSelectedGift === 7 ? 2 : 1) *
            (player.value.field.map((card) => card.id).includes(66) ? 2 : 1);
          sum.def += card.def ?? 0;
          sum.tech += card.tech ?? 0;
          sum.heal += card.heal ?? 0;
          return sum;
        },
        {
          waste: 0,
          hungry: 0,
          priority: 0,
          atk: 0,
          def: 0,
          tech: 0,
          heal: 0,
        }
      ) //!ギフトで999のときにバグる
  );
  //?function/actions
  //Handのカードをクリックしたら、そのカードをFieldに出す
  const pushHand = (index: number): void => {
    const { field, hand } = player.value;
    field.push(hand[index]);
  };
  //Fieldのカードをクリックしたら、そのカードをHandに戻す
  const popHand = (index: number, id: number): void => {
    const { field } = player.value;
    const cardIndex = field.findIndex((card) => card.id === id);
    if (cardIndex === -1) throw new Error("when popHard not found");
    field.splice(cardIndex, 1);
  };
  //ターン終了時に、Fieldのカードを捨てる
  const deleteField = (): void => {
    const { field } = player.value;
    field.splice(0, field.length);
    console.log(i, "fieldDelete");
  };
  //腐っている全てのカードを削除する
  const deleteAllWaste0 = (): number => {
    const { hand } = player.value;
    //forEachの中でspliceを使うとindexがずれるので、whileを使う
    let i = 0;
    let num = 0;
    while (i < hand.length) {
      if (hand[i].waste === 0) {
        hand.splice(i, 1);
        num++;
      } else i++;
    }
    return num;
  };
  //wasteが0のカードを腐らせる
  const checkRotten = (): void => {
    let { hand } = player.value;
    hand.forEach((card) => {
      if (card.waste === 0) {
        hand.splice(hand.indexOf(card), 1);
        hand.unshift(allCards[0]);
      }
    });
  };
  //腐ったカードの枚数分、maxHungryを減らす
  const decMaxHungry = (num: number): void => {
    const { status } = player.value;
    status.maxHungry -= num * 20;
  };
  const $reset = () => {
    id.value = "";
    sign.value = 0;
    player.value = {
      idEnemy: "",
      idGame: "",
      name: "",
      check: false,
      death: false,
      donate: false,
      match: "nothing",
      character: "blankiss",
      gifts: [4, 5, 6],
      isSelectedGift: undefined,
      hand: [],
      field: [],
      status: {
        hp: 600,
        hungry: 0,
        contribution: 0,
        maxHp: 600,
        maxHungry: 200,
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
    };
    phase.value = "none";
    cardLock.value = false;
    offer.value = [];
    log.value = "";
    myLog.value = "";
    enemyLog.value = "";
    components.value = "postBattle";
    battleResult.value = ["none", 0];
  };
  return {
    id,
    sign,
    player,
    phase,
    cardLock,
    offer,
    log,
    myLog,
    enemyLog,
    components,
    battleResult,
    sumCards,
    pushHand,
    popHand,
    deleteField,
    checkRotten,
    deleteAllWaste0,
    decMaxHungry,
    $reset,
  };
});

const useEnemyPlayerStore = defineStore("enemyPlayerData", () => {
  //?Const/State
  const enemyPlayer = ref<PlayerData>({
    idEnemy: "",
    idGame: "",
    name: "",
    check: false,
    death: false,
    donate: false,
    match: "nothing",
    character: "blankiss",
    gifts: [4, 5, 6],
    isSelectedGift: undefined,
    hand: [],
    field: [],
    status: {
      hp: 600,
      hungry: 0,
      contribution: 0,
      maxHp: 600,
      maxHungry: 200,
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
  const $reset = () => {
    enemyPlayer.value = {
      idEnemy: "",
      idGame: "",
      name: "",
      check: false,
      death: false,
      donate: false,
      match: "nothing",
      character: "blankiss",
      gifts: [4, 5, 6],
      isSelectedGift: undefined,
      hand: [],
      field: [],
      status: {
        hp: 600,
        hungry: 0,
        contribution: 0,
        maxHp: 600,
        maxHungry: 200,
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
    };
  };
  return { enemyPlayer, $reset };
});

const useGameStore = defineStore("gameData", () => {
  //?Const/State
  const game = ref<GameData>({
    turn: 1,
    players: [],
    firstAtkPlayer: undefined,
    missionsNum: [],
  });
  const missions = ref<Mission[] | undefined>([]);
  //?Computed/Getter
  ///?function/actions
  //ターン終了時に、turnを1増やす
  const nextTurn = (): void => {
    game.value.turn += 1;
    console.log(i, "turn: ", game.value.turn);
  };
  const $reset = () => {
    game.value = {
      turn: 1,
      players: [],
      firstAtkPlayer: undefined,
      missionsNum: [],
    };
    missions.value = [];
  };

  return { game, missions, nextTurn, $reset };
});

export { useGameStore, useEnemyPlayerStore, usePlayerStore };
