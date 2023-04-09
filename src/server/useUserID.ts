import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

//Collectionの参照
const usersRef = collection(db, "users");

const newUser: User = {
  name: "No name",
  match: 0,
};

//ユーザー登録
export async function registerUser(): Promise<string> {
  try {
    const docRef = await addDoc(usersRef, newUser);
    console.log("Create Your ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return "";
  }
}

//ユーザー削除
export async function deleteUser(userID: string): Promise<void> {
  try {
    await deleteDoc(doc(usersRef, userID));
    console.log("User deleted: ", userID);
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
}

//名前の変更
export async function updateUserName(
  userID: string,
  newName: string
): Promise<string> {
  const userRef = doc(usersRef, userID);
  try {
    await setDoc(userRef, { name: newName }, { merge: true });
    console.log("Name updated for user: ", userID);
    return newName;
  } catch (error) {
    console.error("Error updating name: ", error);
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
      //addGame()みかん誠意
    ]);
    console.log(
      "Match started between: あなた:",
      userID,
      " and 相手:",
      waitingUser
    );
    return waitingUser;
  }
}