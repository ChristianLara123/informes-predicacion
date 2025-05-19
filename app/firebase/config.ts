// app/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMtDQSKF3_eiZlvGs2nfCT2UQe87FIuBc",
  authDomain: "informes-de-predicacion.firebaseapp.com",
  projectId: "informes-de-predicacion",
  storageBucket: "informes-de-predicacion.firebasestorage.app",
  messagingSenderId: "835518131405",
  appId: "1:835518131405:web:4af1bceb3f803e3cd80d84",
  measurementId: "G-E72ZH859TZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app);