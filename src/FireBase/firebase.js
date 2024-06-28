import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Initialize your firebase app
const firebaseConfig = {
    apiKey: "AIzaSyChyEoaROcITOEnnPFarfpLP8JvD6rqX-c",
    authDomain: "testproject-fd2d8.firebaseapp.com",
    databaseURL: "https://testproject-fd2d8.firebaseio.com",
    projectId: "testproject-fd2d8",
    storageBucket: "testproject-fd2d8.appspot.com",
    messagingSenderId: "1030523348601",
    appId: "1:1030523348601:web:715d0ed8812ec48ce116a8",
    measurementId: "G-WKHP08D8XH"
}

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp;
