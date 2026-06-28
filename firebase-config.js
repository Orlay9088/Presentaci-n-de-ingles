// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAytS5R-avpHCJr-haj1KNmfLtfe4MfpdM",
  authDomain: "ai-presentacion-votos.firebaseapp.com",
  databaseURL: "https://ai-presentacion-votos-default-rtdb.firebaseio.com",
  projectId: "ai-presentacion-votos",
  storageBucket: "ai-presentacion-votos.firebasestorage.app",
  messagingSenderId: "3439249753",
  appId: "1:3439249753:web:fcea7a7476645fe457a448",
  measurementId: "G-297133FJBS"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const votesRef = db.ref('presentacion/votos');
