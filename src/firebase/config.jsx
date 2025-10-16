import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDSKgUwZ5b8ZNM_3MX36XOSwMi6IuXQGm8",
  authDomain: "mtc9820201216.firebaseapp.com",
  projectId: "mtc9820201216",
  storageBucket: "mtc9820201216.appspot.com",
  messagingSenderId: "356765302606",
  appId: "1:356765302606:web:22142c8f99b9abd6aea81f"
}

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()
// timestamp
const timestamp = firebase.firestore.Timestamp


export { projectFirestore, projectAuth, timestamp, projectStorage }