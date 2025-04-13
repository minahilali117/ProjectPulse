import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "dummy",
  authDomain: "dummy.firebaseapp.com",
  projectId: "dummy",
  storageBucket: "dummy.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:dummy"
};

export const app = initializeApp(firebaseConfig);
