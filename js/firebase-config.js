// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// CONFIG DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCQDmhKoqNahIjlD87opyXFvs8XvGoAFcQ",
    authDomain: "crm-clientes-ca630.firebaseapp.com",
    projectId: "crm-clientes-ca630",
    storageBucket: "crm-clientes-ca630.firebasestorage.app",
    messagingSenderId: "769427391689",
    appId: "1:769427391689:web:ca38fba828d006e7cbb918"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// AUTH
const auth = getAuth(app);

// Google Provider
const provider = new GoogleAuthProvider();

// Exportações
export {
    auth,
    provider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
};
