// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
  apiKey: "AIzaSyAawjWKU3dLVKbnz4da85b19pvl3btgjCk",
  authDomain: "sujeitopost-83bc2.firebaseapp.com",
  projectId: "sujeitopost-83bc2",
  storageBucket: "sujeitopost-83bc2.appspot.com",
  messagingSenderId: "587766510139",
  appId: "1:587766510139:web:7826678e340caccdb0221e",
  measurementId: "G-HBRHXC4WD3"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;