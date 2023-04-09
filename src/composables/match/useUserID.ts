import { db } from "@/main";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

//Collectionの参照
const usersRef = collection(db, "users");
const gamesRef = collection(db, "games");

//ユーザー登録
export async function registerUser(name: string): Promise<string> {
  const newUser: User = {
    name: "",
    match: 0,
  };

  try {
    const docRef = await addDoc(usersRef, newUser);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return "";
  }
}

//ユーザー情報の取得
export async function updateMatchStatus(
  userID: string,
  matchStatus: -1 | 0 | 1
): Promise<void> {
  const userRef = doc(usersRef, userID);
  try {
    await setDoc(userRef, { match: matchStatus }, { merge: true });
    console.log("Match status updated for user: ", userID);
  } catch (error) {
    console.error("Error updating match status: ", error);
  }
}

//マッチング待機中のユーザーを検索する
export async function findWaitingUser(): Promise<string | null> {
  const querySnapshot = await getDocs(query(usersRef, where("match", "==", 1)));
  if (querySnapshot.size === 0) {
    return null;
  }
  const users = querySnapshot.docs.map((doc) => doc.id);
  return users[Math.floor(Math.random() * users.length)];
}

//マッチングを開始する
export async function startMatchmaking(userID: string): Promise<string | null> {
  // マッチング待機中のユーザーを検索する
  const waitingUser = await findWaitingUser();
  if (!waitingUser) {
    // マッチング待機中のユーザーがいない場合は、マッチング待機中にする
    await updateMatchStatus(userID, 1);
    return null;
  } else {
    // マッチング待機中のユーザーがいる場合は、対戦状態に更新する
    await Promise.all([
      updateMatchStatus(userID, -1),
      updateMatchStatus(waitingUser, -1),
      addGame(),
    ]);
    console.log("Match started between: ", userID, " and ", waitingUser);
    return waitingUser;
  }
}

//ゲーム終了時にマッチング状態を更新する
export async function endMatchmaking(userID: string): Promise<void> {
  await updateMatchStatus(userID, 0);
}

// ゲームを作成する
export async function addGame() {
  const newGame: Game = {
    turn: 1,
    players: {
      player1: {
        name: "player1",
        id: "player1_id",
        hand: [],
        board: [],
        status: {
          atk: 0,
          def: 0,
          hp: 400,
          hungry: 0,
          matk: 0,
          mdef: 0,
        },
      },
      player2: {
        name: "player2",
        id: "player2_id",
        hand: [],
        board: [],
        status: {
          atk: 0,
          def: 0,
          hp: 400,
          hungry: 0,
          matk: 0,
          mdef: 0,
        },
      },
    },
  };
  
  try {
    const docRef = await addDoc(gamesRef, newGame);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
