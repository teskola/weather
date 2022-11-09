import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

export { auth, sendPasswordReset, firebaseConfig };
