// import {initializeApp} from "firebase/app";
// import {getFirestore} from "firebase/firestore";
// import {getStorage} from "firebase/storage";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
const firebaseConfig = {
    apiKey: "AIzaSyCKc8lW5aAoNHDDnz23ePBKdtbdWaRHy98",
    authDomain: "insta-clone-583dc.firebaseapp.com",
    projectId: "insta-clone-583dc",
    storageBucket: "insta-clone-583dc.appspot.com",
    messagingSenderId: "264002911395",
    appId: "1:264002911395:web:40070db482e9a1015d9316"
};
// const app = initializeApp(firebaseConfig)
// const db = getFirestore(app);
// const storage = getStorage();

// export {app,db,storage}
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, storage };
export default firebase