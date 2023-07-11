// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHI04WJTn2fIUh-IZfqLzE3trwGymrwks",
    authDomain: "test28-06-2023.firebaseapp.com",
    projectId: "test28-06-2023",
    storageBucket: "test28-06-2023.appspot.com",
    messagingSenderId: "365198892772",
    appId: "1:365198892772:web:cc8aeae7d15d60925596f1",
    measurementId: "G-TCZMCK1GPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)




