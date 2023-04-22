import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { Game } from "@/types";

//Collectionの参照
const gamesRef = collection(db, "games");
const deckRef = collection(db, "deck");

//Game情報を取得
async function getGameData(GameID: string): Promise<{ id: string; data: Game }> {
  const docSnap = await getDoc(doc(gamesRef, GameID));
  if (docSnap.exists()) {
    return { id: docSnap.id, data: docSnap.data() as Game };
  } else {
    console.log("No such document!");
    return { id: "", data: docSnap.data() as Game }; //!修正します5日
  }
}

//両playerの決定を取得
async function check(playerID: string) {}

//statusを変更 増減値を引数
async function changeStatus(playerID: String) {}

//cardをセット
async function setCard(playerID: string, cardID: number) {}

//missionをセット
async function setMission(playerID: string, missionID: number) {}

//?初回限定の処理
async function firstTurn(playerID: string) {}

//cardを一枚引く
export async function drawCard() {
  const deckSnap = await getDocs(deckRef);
  const deck = deckSnap.docs.map((doc) => doc.data());
  const selectCard = Math.floor(Math.random() * deck.length);
  return deck[selectCard];
}

//giftを使用
async function useGift(playerID: string, giftID: number) {}

//?actionフェーズ開始時の処理
async function startActionPhase(playerID: string) {}

//cardを選択して場に出す
async function playCard(playerID: string, cardID: number) {}

//?mainフェーズ開始時の処理
async function startMainPhase(playerID: string) {}

//使用したgiftを公開
async function openGift(playerID: string, giftID: number) {}

//?actionフェーズ終了時の処理
async function endActionPhase(playerID: string) {}

//どちらが先に攻撃するのか判定
async function priority(playerID: string) {}

//cardの攻撃力を計算
async function calcPow(playerID: string, cardID: number) {}

//cardのテクニックを計算
async function calcTech(playerID: string, cardID: number) {}

//cardの防御力を計算
async function calcDef(playerID: string, cardID: number) {}

//cardの特殊効果を実行
async function useSpecial(playerID: string, cardID: number) {}

//hungryを計算 上限を超えたら行動不能
async function calcHungry(playerID: string, cardID: number) {}

//damage計算の結果を出力
async function calcDamage(playerID: string, cardID: number) {}

//missionを達成した時の処理
async function completeMission(playerID: string, missionID: number) {}

//missionを入れ替える
async function changeMission(playerID: string, missionID: number) {
  const gameData = await getGameData(playerID).then((game) => game.data);
  if (gameData.turn % 4 == 0) {
    return;
  }
}

//勝敗判断 死亡判断から呼び出す
async function isWin(playerID: string) {}

//死亡判断
async function isDead(playerID: string) {}

//wasteを減少
async function decWaste(playerID: string, cardID: number) {}

//wasteが0になった時の処理
async function wasteRot(playerID: string, cardID: number) {}

//turnを進める 増減値を引数
async function incTurn(playerID: string, turn: number) {}

//?mainフェーズ終了時の処理
async function endMainPhase(playerID: string) {}

//?game終了時の処理
async function endGame(playerID: string) {}

//!すべてのフェーズ管理
export async function useBattle(GameID: string): Promise<Game|undefined> {
  const gameData = (await getGameData(GameID)).data;
  //?初回のみの処理
  if (gameData.turn == 1) {
    
    console.log("turn:" + gameData.turn);
    return gameData;
  }
  console.log("fin");
  
  return gameData;
}

//!export5日まとめる
