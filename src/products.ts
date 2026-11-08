import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query
} from "firebase/firestore";

import { db } from "./firebase";

export interface Product {
  id?: string;
  title: string;
  category: string;
  description: string;
  price: number;
  oldPrice?: number;
  image?: string;
  downloadUrl?: string;
  featured: boolean;
  createdAt?: number;
}

const productsRef = collection(db, "products");

// Get all products
export async function getProducts(): Promise<Product[]> {
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  })) as Product[];
}

// Add product
export async function addProduct(product: Product) {
  const { id, ...data } = product;

  return await addDoc(productsRef, {
    ...data,
    createdAt: Date.now()
  });
}

// Update product
export async function updateProduct(
  id: string,
  product: Partial<Product>
) {
  const { id: ignoredId, ...data } = product;

  return await updateDoc(doc(db, "products", id), data);
}

// Delete product
export async function deleteProduct(id: string) {
  return await deleteDoc(doc(db, "products", id));
}
