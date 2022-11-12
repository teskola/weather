import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDg0mzMxP6GjArBrFYthymVlCV6capREcA",
  authDomain: "weatherlocations.firebaseapp.com",
  databaseURL:
    "https://weatherlocations-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "weatherlocations",
  storageBucket: "weatherlocations.appspot.com",
  messagingSenderId: "6463695715",
  appId: "1:6463695715:web:8371e6fe38391835b58156",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const fb_url = firebaseConfig.databaseURL;
export { auth, fb_url };
