
const firebaseConfig = {
  apiKey: "AIzaSyCQDmhKoqNahIjlD87opyXFvs8XvGoAFcQ",
  authDomain: "crm-clientes-ca630.firebaseapp.com",
  projectId: "crm-clientes-ca630",
  storageBucket: "crm-clientes-ca630.firebasestorage.app",
  messagingSenderId: "769427391689",
  appId: "1:769427391689:web:ca38fba828d006e7cbb918"
};

// 2. Inicializar o Firebase
// (Isso usa o 'firebase' global dos scripts -compat.js)
firebase.initializeApp(firebaseConfig);

// 3. Disponibilizar os serviços para outros scripts
const auth = firebase.auth();
const db = firebase.firestore(); // Já deixando o db pronto para as outras telas