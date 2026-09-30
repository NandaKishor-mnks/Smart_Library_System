// Firebase connection for Smart Library
const firebaseConfig = {
  apiKey: "AIzaSyDBWm8UIBWDVvqE4hOcSyyaDD9Wa5VVlBg",
  authDomain: "smart-library-cb978.firebaseapp.com",
  projectId: "smart-library-cb978",
  storageBucket: "smart-library-cb978.firebasestorage.app",
  messagingSenderId: "500294679481",
  appId: "1:500294679481:web:0002c67c36823a80c59468",
  measurementId: "G-EWHWZ35CMQ"
};

try {
  firebase.initializeApp(firebaseConfig);
  window.firebaseAuth = firebase.auth();
  window.firebaseDb = firebase.firestore();
  window.firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});
  console.log('Firebase connected:', firebaseConfig.projectId);
} catch (e) {
  console.error('Firebase initialization failed:', e);
}
