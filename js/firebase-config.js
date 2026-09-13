/**
 * Firebase SDK Integration & Configuration
 * Project: insaf-collection-gazipur-zone
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDczKGdwPcSS02xnC7EkJdp80XUobFF_NE",
  authDomain: "insaf-collection-gazipur-zone.firebaseapp.com",
  projectId: "insaf-collection-gazipur-zone",
  storageBucket: "insaf-collection-gazipur-zone.firebasestorage.app",
  messagingSenderId: "634973136579",
  appId: "1:634973136579:web:bc0753314559115567a476",
  measurementId: "G-QQ37VQ563G"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Optional Analytics initialization if supported
isSupported().then(supported => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(() => {});

// Attach globally for real-time cloud sync & offline fallback
window.FirebaseDB = {
  app,
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot
};

// Cloud Realtime Synchronization Bridge
export async function syncOrderToFirebase(order) {
  try {
    await setDoc(doc(db, "orders", order.orderId), order);
    console.log("Order synced with Firebase Cloud Firestore:", order.orderId);
  } catch (err) {
    console.warn("Firestore sync offline fallback:", err.message);
  }
}

export async function syncProductToFirebase(product) {
  try {
    await setDoc(doc(db, "products", product.id), product);
    console.log("Product synced with Firebase Cloud Firestore:", product.id);
  } catch (err) {
    console.warn("Firestore product sync fallback:", err.message);
  }
}

export async function syncSettingsToFirebase(settings) {
  try {
    await setDoc(doc(db, "settings", "global_settings"), settings);
    console.log("Settings synced with Firebase Cloud Firestore");
  } catch (err) {
    console.warn("Firestore settings sync fallback:", err.message);
  }
}

console.log("Firebase initialized for insaf-collection-gazipur-zone");
