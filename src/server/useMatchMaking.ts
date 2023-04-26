import { db } from "./firebase";
import { collection, doc, addDoc, updateDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { getPlayerData } from "./usePlayerID";
import type { GameData, MatchStatus, PlayerData } from "@/types";
import { router } from "@/router";

//Collectionの参照
const playersRef = collection(db, "players");
const gamesRef = collection(db, "games");

//マッチング待機中のplayerを検索する
async function findWaitingPlayer(playerID: string): Promise<string | undefined> {
  const waitingPlayers = (await getDocs(query(playersRef, where("match", "==", "waiting")))).docs.map((doc) => doc.id);
  console.log("Found players: ", waitingPlayers);
  if (waitingPlayers.length < 2) {
    console.log("Not enough players to start a game");
    return undefined;
  }
  // 自分を除外する
  waitingPlayers.splice(waitingPlayers.indexOf(playerID), 1);
  // ランダムに選択する
  const waitingPlayer = waitingPlayers[Math.floor(Math.random() * waitingPlayers.length)];
  console.log("Found player: ", waitingPlayer);
  return waitingPlayer;
}

//playerのフィールド名を更新する
async function updatePlayerField(
  playerID: string,
  field: keyof PlayerData,
  value: string | MatchStatus | number
): Promise<void> {
  try {
    await updateDoc(doc(playersRef, playerID), { [field]: value });
    console.log(field, "updated: ", value, " for player: ", playerID);
  } catch (error) {
    console.error("Error updating match status: ", error);
  }
}

//playerのフィールド名を複数更新する
async function updatePlayerFields(
  playerID: string,
  updates: Array<{ field: keyof PlayerData; value: string | MatchStatus }>
): Promise<void> {
  updates.forEach((update) => {
    updatePlayerField(playerID, update.field, update.value);
  });
}

//matchの値が-1に変更されたら検知して、gameを開始する
async function watchMatchField(ownPlayerID: string): Promise<void> {
  const unsubscribe = onSnapshot(doc(playersRef, ownPlayerID), (doc) => {
    const data = doc.data();
    if (!data) return;
    // 監視対象のフィールドが指定した値になった場合に実行される処理
    if (data.match === "matching") {
      console.log("matchが", data.match, "に変更されました");
      //waitingPlayerIDを入手する
      const waitingPlayerID = data.idEnemy;
      console.log("waitingPlayerID: ", waitingPlayerID);
      //gameIDを入手する
      const idGame = data.idGame;
      console.log("idGame: ", idGame);
      // 監視を解除
      unsubscribe();
      //画面遷移
      console.log("マッチ成功!相手ID:", waitingPlayerID, "ゲームID:", idGame);
      router.push({ name: "battle", params: { idGame: idGame } });
    }
  });
}

//マッチングを開始する
async function startMatchmaking(ownPlayerID: string): Promise<string> {
  // マッチング待機中のユーザーを検索する
  await updatePlayerField(ownPlayerID, "match", "waiting");
  const waitingPlayerID = await findWaitingPlayer(ownPlayerID);

  // マッチング待機中のユーザーがいない場合は、マッチング待機中にする
  if (!waitingPlayerID) {
    console.log("マッチング待機中...");
    await watchMatchField(ownPlayerID);
    return "";
  } else {
    const idGame = await addGame(waitingPlayerID, ownPlayerID);
    //プレイヤーの情報を更新する
    await Promise.all([
      updatePlayerFields(waitingPlayerID, [
        { field: "idEnemy", value: ownPlayerID },
        { field: "idGame", value: idGame },
        { field: "match", value: "matching" },
      ]),
      updatePlayerFields(ownPlayerID, [
        { field: "idEnemy", value: waitingPlayerID },
        { field: "idGame", value: idGame },
        { field: "match", value: "matching" },
      ]),
    ]);
    //画面遷移
    console.log("マッチ成功!相手ID:", waitingPlayerID, "ゲームID:", idGame);
    router.push({ name: "battle", params: { idGame: idGame } });
    console.log("rooting complete");

    return idGame;
  }
}

//gameを作成する
async function addGame(player1: string, player2: string): Promise<string> {
  const newGame: GameData = {
    turn: 1,
    players: [player1, player2],
    missions: [],
  };

  try {
    const docRef = await addDoc(gamesRef, newGame);
    console.log("games Document ID: ", docRef.id);
    if (docRef.id) {
      return docRef.id;
    } else {
      console.log("No such gameDocument!");
    }
  } catch (error) {
    console.error("Error adding games document: ", error);
  }
  return "";
}

//gameを削除する
async function deleteGame(gameID: string): Promise<void> {}

export { getPlayerData, updatePlayerField, startMatchmaking };
