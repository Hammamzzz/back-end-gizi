// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUrplgE4qxYffxzhth6GzpI8v79So315U",
  authDomain: "web-based-gizi.firebaseapp.com",
  databaseURL: "https://web-based-gizi-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "web-based-gizi",
  storageBucket: "web-based-gizi.appspot.com",
  messagingSenderId: "1075819463961",
  appId: "1:1075819463961:web:f1a36948e5bf46ebcbf188"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = db;