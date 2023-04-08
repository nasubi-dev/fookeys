import { db } from "@/main";
import {
  collection,
  addDoc,
  doc,
  where,
  query,
  getDocs,
  updateDoc,
} from "firebase/firestore";

type User = {
  name: string;
  match: number;
};

// usersコレクションの参照を取得
const usersCollection = collection(db, 'users');

export async function registerUser(name: string): Promise<string> {
  // Firestoreに新しいドキュメントを追加して、ドキュメントIDを取得
  const userRef = await addDoc(usersCollection, { name: name, match: 0 });
  console.log("Document written with ID: ", userRef.id, "name:", name);
  return userRef.id;
}

// マッチング待機中のユーザーを検索
async function searchUsers() {
  const q = query(collection(db, "users"), where("match", "==", 1));
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  console.log(`${users.length} users are waiting for matching.`);
  return users;
}

// マッチング待機中のユーザーをペアリングする
async function pairUsers() {
  const users = await searchUsers();
  if (users.length < 2) {
    console.log('Not enough users are waiting for matching.');
    return;
  }
  const player1 = users[0];
  const player2 = users[1];
  console.log(`Match started between ${player1.id} and ${player2.id}.`);
  await Promise.all([
    updateDoc(doc(db, 'users', player1.id), { match: -1 }),
    updateDoc(doc(db, 'users', player2.id), { match: -1 }),
  ]);
}

// マッチング状態を更新する
export async function updateMatchStatus(userId: string, matchStatus: number) {
  await updateDoc(doc(db, 'users', userId), { match: matchStatus });
  console.log(`User ${userId}'s match status is updated to ${matchStatus}.`);
}