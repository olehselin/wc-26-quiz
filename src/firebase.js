import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google popup
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

/**
 * Fetch all questions from Firestore
 * @returns {Promise<Array>}
 */
export async function fetchQuestions() {
  const snapshot = await getDocs(collection(db, "questions"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Save a score to the leaderboard
 */
export async function saveScore({
  userId,
  displayName,
  photoURL,
  score,
  totalTime,
}) {
  return addDoc(collection(db, "leaderboard"), {
    userId,
    displayName,
    photoURL,
    score,
    totalTime,
    playedAt: serverTimestamp(),
  });
}

/**
 * Fetch top leaderboard entries
 * sorted by score DESC, then totalTime ASC
 */
export async function fetchLeaderboard(max = 10) {
  // Firestore doesn't support multi-field mixed ordering in one query easily,
  // so we fetch more and sort client-side
  const q = query(
    collection(db, "leaderboard"),
    orderBy("score", "desc"),
    limit(50),
  );
  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Secondary sort: if score is equal, lower totalTime wins
  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.totalTime - b.totalTime;
  });

  return entries.slice(0, max);
}
