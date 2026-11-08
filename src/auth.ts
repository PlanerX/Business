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

// Verify admin identity
export function isAdmin(user: User | null): boolean {
  const adminUID = import.meta.env.VITE_ADMIN_UID;

  return Boolean(user && adminUID && user.uid === adminUID);
}

// Admin logout
export async function adminLogout() {
  await signOut(auth);
}

// Check authentication
export function checkAuth(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}
