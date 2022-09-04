import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCtFltvP8WZ_oTeARHQzVJd0pgxA0jH5pw",
  authDomain: "instagram-clone-react-410b6.firebaseapp.com",
  projectId: "instagram-clone-react-410b6",
  storageBucket: "instagram-clone-react-410b6.appspot.com",
  messagingSenderId: "1036291906755",
  appId: "1:1036291906755:web:4b6ad891dc5780ae601676",
  measurementId: "G-49Q1B0CDVP",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, storage };
