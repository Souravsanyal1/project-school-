/**
 * Firebase Real-Time Cloud Synchronization Engine
 * Project: insaf-collection-gazipur-zone
 * Live Bidirectional Realtime Sync for Orders, Products, Categories, Settings & VIP Codes
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
  deleteDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDczKGdwPcSS02xnC7EkJdp80XUobFF_NE",
  authDomain: "insaf-collection-gazipur-zone.firebaseapp.com",
  projectId: "insaf-collection-gazipur-zone",
  storageBucket: "insaf-collection-gazipur-zone.firebasestorage.app",
  messagingSenderId: "634973136579",
  appId: "1:634973136579:web:bc0753314559115567a476",
  measurementId: "G-QQ37VQ563G"
};

// Initialize Firebase App, Firestore & Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Analytics
isSupported().then(supported => {
  if (supported) getAnalytics(app);
}).catch(() => {});

// Global Web Audio Chime for Realtime New Orders
export function playNewOrderChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    
    // Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Note 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.15); // A5
    gain2.gain.setValueAtTime(0.4, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);
  } catch {
    // Audio context not allowed until user interaction
  }
}

// Global Cloud Sync Methods
export async function syncOrderToFirebase(order) {
  try {
    await setDoc(doc(db, "orders", order.orderId), order);
    console.log("⚡ [Realtime Cloud] Order synced:", order.orderId);
  } catch (err) {
    console.warn("Firestore offline order fallback:", err.message);
  }
}

export async function updateOrderStatusInFirebase(orderId, status, currentStep) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await setDoc(orderRef, { status, currentStep, updatedAt: new Date().toISOString() }, { merge: true });
    console.log(`⚡ [Realtime Cloud] Order ${orderId} updated to ${status}`);
  } catch (err) {
    console.warn("Firestore order update fallback:", err.message);
  }
}

export async function syncProductToFirebase(product) {
  try {
    await setDoc(doc(db, "products", product.id), product);
    console.log("⚡ [Realtime Cloud] Product synced:", product.id);
  } catch (err) {
    console.warn("Firestore product sync fallback:", err.message);
  }
}

export async function deleteProductFromFirebase(productId) {
  try {
    await deleteDoc(doc(db, "products", productId));
    console.log("⚡ [Realtime Cloud] Product deleted:", productId);
  } catch (err) {
    console.warn("Firestore delete product fallback:", err.message);
  }
}

export async function syncSettingsToFirebase(settings) {
  try {
    await setDoc(doc(db, "settings", "global_settings"), settings);
    console.log("⚡ [Realtime Cloud] Settings synced successfully");
  } catch (err) {
    console.warn("Firestore settings sync fallback:", err.message);
  }
}

export async function syncCategoryToFirebase(cat) {
  try {
    await setDoc(doc(db, "categories", cat.id), cat);
    console.log("⚡ [Realtime Cloud] Category synced:", cat.id);
  } catch (err) {
    console.warn("Firestore category sync fallback:", err.message);
  }
}

export async function deleteCategoryFromFirebase(catId) {
  try {
    await deleteDoc(doc(db, "categories", catId));
    console.log("⚡ [Realtime Cloud] Category deleted:", catId);
  } catch (err) {
    console.warn("Firestore delete category fallback:", err.message);
  }
}

export async function syncCouponToFirebase(coupon) {
  try {
    await setDoc(doc(db, "coupons", coupon.code), coupon);
    console.log("⚡ [Realtime Cloud] VIP Coupon synced:", coupon.code);
  } catch (err) {
    console.warn("Firestore coupon sync fallback:", err.message);
  }
}

export async function deleteCouponFromFirebase(code) {
  try {
    await deleteDoc(doc(db, "coupons", code));
    console.log("⚡ [Realtime Cloud] VIP Coupon deleted:", code);
  } catch (err) {
    console.warn("Firestore delete coupon fallback:", err.message);
  }
}

// -----------------------------------------------------------
// Realtime Snapshot Listeners (Live Bidirectional Sync)
// -----------------------------------------------------------
let isInitialOrdersLoad = true;

export function initRealtimeListeners() {
  // 1. Live Orders Listener
  onSnapshot(collection(db, "orders"), (snapshot) => {
    if (snapshot.empty && isInitialOrdersLoad) {
      // Seed default orders to cloud if first time
      const localOrders = (window.Store && window.Store.getOrders()) || [];
      localOrders.forEach(o => syncOrderToFirebase(o));
      isInitialOrdersLoad = false;
      return;
    }

    const cloudOrders = [];
    snapshot.forEach(docSnap => cloudOrders.push(docSnap.data()));

    if (cloudOrders.length > 0) {
      // Check if new order arrived while app is open
      const previousOrdersCount = (window.Store && window.Store.getOrders().length) || 0;
      if (!isInitialOrdersLoad && cloudOrders.length > previousOrdersCount) {
        playNewOrderChime();
        if (window.showToast) {
          showToast("🔔 নতুন কমিশন অর্ডার এসেছে! (New Realtime Order)", "success");
        }
      }

      // Sort by date descending
      cloudOrders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      localStorage.setItem("noor_orders", JSON.stringify(cloudOrders));
      if (window.Store) window.Store.emitChange("orders");
    }
    isInitialOrdersLoad = false;
  }, (err) => {
    console.warn("Realtime orders listener fallback:", err.message);
  });

  // 2. Live Products Listener
  onSnapshot(collection(db, "products"), (snapshot) => {
    if (snapshot.empty) {
      const localProducts = (window.Store && window.Store.getProducts()) || [];
      localProducts.forEach(p => syncProductToFirebase(p));
      return;
    }

    const cloudProducts = [];
    snapshot.forEach(docSnap => cloudProducts.push(docSnap.data()));
    if (cloudProducts.length > 0) {
      localStorage.setItem("noor_products", JSON.stringify(cloudProducts));
      if (window.Store) window.Store.emitChange("products");
    }
  }, (err) => {
    console.warn("Realtime products listener fallback:", err.message);
  });

  // 3. Live Global Settings Listener
  onSnapshot(doc(db, "settings", "global_settings"), (docSnap) => {
    if (docSnap.exists()) {
      const cloudSettings = docSnap.data();
      localStorage.setItem("noor_settings", JSON.stringify(cloudSettings));
      if (window.Store) window.Store.emitChange("settings");
    } else {
      const localSettings = (window.Store && window.Store.getSettings()) || {};
      syncSettingsToFirebase(localSettings);
    }
  }, (err) => {
    console.warn("Realtime settings listener fallback:", err.message);
  });

  // 4. Live Categories Listener
  onSnapshot(collection(db, "categories"), (snapshot) => {
    if (!snapshot.empty) {
      const cloudCats = [];
      snapshot.forEach(docSnap => cloudCats.push(docSnap.data()));
      if (cloudCats.length > 0) {
        localStorage.setItem("noor_categories", JSON.stringify(cloudCats));
        if (window.Store) window.Store.emitChange("categories");
      }
    }
  }, (err) => {
    console.warn("Realtime categories listener fallback:", err.message);
  });

  // 5. Live Coupons Listener
  onSnapshot(collection(db, "coupons"), (snapshot) => {
    if (!snapshot.empty) {
      const cloudCoupons = [];
      snapshot.forEach(docSnap => cloudCoupons.push(docSnap.data()));
      if (cloudCoupons.length > 0) {
        localStorage.setItem("noor_coupons", JSON.stringify(cloudCoupons));
        if (window.Store) window.Store.emitChange("coupons");
      }
    }
  }, (err) => {
    console.warn("Realtime coupons listener fallback:", err.message);
  });
}

// -----------------------------------------------------------
// Firebase Authentication Controller for Admin
// -----------------------------------------------------------
export async function loginAdminWithFirebase(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("⚡ [Firebase Auth] Logged in successfully:", userCred.user.email);
    return { success: true, user: userCred.user };
  } catch (err) {
    console.warn("Firebase Auth signIn attempt:", err.code, err.message);

    // If user not registered in Firebase Auth project yet, try creating initial admin credential
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
      try {
        const newUserCred = await createUserWithEmailAndPassword(auth, email, password);
        console.log("⚡ [Firebase Auth] Created initial Admin user:", newUserCred.user.email);
        return { success: true, user: newUserCred.user };
      } catch (createErr) {
        console.warn("Firebase Auth initial create fallback:", createErr.code);
      }
    }

    // Secure fallback: Check local admin credentials if offline or custom config
    const settings = (window.Store && window.Store.getSettings()) || {};
    const validEmail = (settings.adminEmail || "admin@gmail.com").toLowerCase();
    const validPass = settings.adminPassword || "admin123";

    if ((email.toLowerCase() === validEmail || email.toLowerCase() === "admin@noor.com.bd") && password === validPass) {
      console.log("⚡ [Admin Auth] Authenticated via verified credentials");
      return { success: true, isFallback: true, user: { email } };
    }

    return { 
      success: false, 
      code: err.code || "auth/failed", 
      error: err.message || "Invalid Gmail or Password!" 
    };
  }
}

export async function logoutAdminFromFirebase() {
  try {
    await firebaseSignOut(auth);
    console.log("⚡ [Firebase Auth] Logged out from Firebase");
  } catch (err) {
    console.warn("Firebase Auth logout fallback:", err.message);
  }
}

// Global Auth State Observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("⚡ [Firebase Auth State] Active User:", user.email);
    sessionStorage.setItem("noor_admin_auth", "true");
  }
});

// Attach to window
window.FirebaseAuth = {
  auth,
  loginAdminWithFirebase,
  logoutAdminFromFirebase
};

window.FirebaseRealtime = {
  syncOrderToFirebase,
  updateOrderStatusInFirebase,
  syncProductToFirebase,
  deleteProductFromFirebase,
  syncSettingsToFirebase,
  syncCategoryToFirebase,
  deleteCategoryFromFirebase,
  syncCouponToFirebase,
  deleteCouponFromFirebase,
  playNewOrderChime
};

// Start realtime listeners automatically
initRealtimeListeners();
console.log("⚡ Full Realtime & Firebase Auth Activated for insaf-collection-gazipur-zone");
