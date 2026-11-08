import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";

import { auth } from "./firebase";

// Admin login
export async function adminLogin(
  email: string,
  password: string
) {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
}

// Admin logout
export async function adminLogout() {
  await signOut(auth);
}

// Check login status
export function checkAuth(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}
