// firebase.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzhgT90K9dOc33AoRUXs1qIFUIkDtNwVM",
  authDomain: "bookmyshow-clone-js-project.firebaseapp.com",
  projectId: "bookmyshow-clone-js-project",
  storageBucket: "bookmyshow-clone-js-project.appspot.com",
  messagingSenderId: "783788577661",
  appId: "1:783788577661:web:084cab22a085f080a57214"
};

// Initialize Firebase and export auth modules
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
