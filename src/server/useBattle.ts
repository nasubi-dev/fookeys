import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Game } from "@/types";

//Collectionの参照
const gamesRef = collection(db, "games");
const playersRef = collection(db, "players");
const deckRef = collection(db, "deck");

//Game情報を取得
async function getPlayer(GameID:string): Promise<{ id: string; data: Game }> {
  const docSnap = await getDoc(doc(gamesRef, GameID));
  if (docSnap.exists()) {
    return { id: docSnap.id, data: docSnap.data() as Game };
  } else {
    console.log("No such document!");
    return { id: "", data: docSnap.data() as Game }; //!修正します5日
  }
}

//両プレイヤーがturn終了ボタンを押した時の処理
export async function endTurn(playerID: string) {}

//statusを変更 増減値を引数
export async function changeStatus(playerID: string, hp: number, hungry: number, contribution: number) {}

  //cardをセット
  export async function setCard(playerID: string, cardID: number) {}

  //ミッションをセット
  export async function setMission(playerID: string, missionID: number) {}

//?初回限定の処理
export async function firstTurn(playerID: string) {}

  //cardを一枚引く
  export async function drawCard() {
    const deckSnap = await getDocs(deckRef);
    const deck = deckSnap.docs.map((doc) => doc.data());
    const selectCard = Math.floor(Math.random() * deck.length);
    return deck[selectCard];
  }

  //giftを使用
  export async function useGift(playerID: string, giftID: number) {}

//?actionフェーズ開始時の処理
export async function startActionPhase(playerID: string) {}


  //cardを選択して場に出す
  export async function playCard(playerID: string, cardID: number) {}

//?mainフェーズ開始時の処理
export async function startMainPhase(playerID: string) {}


  //使用したgiftを公開
  export async function openGift(playerID: string, giftID: number) {}

//?actionフェーズ終了時の処理
export async function endActionPhase(playerID: string) {}


  //どちらが先に攻撃するのか判定
  export async function priority(playerID: string) {}

    //cardの攻撃力を計算
    export async function calcPow(playerID: string, cardID: number) {}

    //cardのテクニックを計算
    export async function calcTech(playerID: string, cardID: number) {}

    //cardの防御力を計算
    export async function calcDef(playerID: string, cardID: number) {}

    //cardの特殊効果を実行
    export async function useSpecial(playerID: string, cardID: number) {}

    //hungryを計算 上限を超えたら行動不能
    export async function calcHungry(playerID: string, cardID: number) {}

  //damage計算の結果を出力
  export async function calcDamage(playerID: string, cardID: number) {}

  //missionを達成した時の処理
  export async function completeMission(playerID: string, missionID: number) {}
  
  //missionを入れ替える
  export async function changeMission(playerID: string, missionID: number) {
    const gameData =await getPlayer(playerID).then((game) => game.data);
    if(gameData.turn%4==0){
      return;
    }
  }
  
    //勝敗判断 死亡判断から呼び出す
    export async function isWin(playerID: string) {}

  //死亡判断
  export async function isDead(playerID: string) {}

  //wasteを減少
  export async function decWaste(playerID: string, cardID: number) {}

  //wasteが0になった時の処理
  export async function wasteRot(playerID: string, cardID: number) {}

  //turnを進める 増減値を引数
  export async function incTurn(playerID: string, turn: number) {}

//?mainフェーズ終了時の処理
export async function endMainPhase(playerID: string) {}

//?game終了時の処理
export async function endGame(playerID: string) {}

//!すべてのフェーズ管理
export async function useBattle(playerID: string) {}

//!export5日まとめる