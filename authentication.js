// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzOF_YRzD3_Rib5FcqJlmIKGKDQZl0eT0",
    authDomain: "tpf-form-5387e.firebaseapp.com",
    projectId: "tpf-form-5387e",
    storageBucket: "tpf-form-5387e.firebasestorage.app",
    messagingSenderId: "253783406936",
    appId: "1:253783406936:web:811278521dba13c2018d2d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const userSignIn = async () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
};

const userSignOut = async () => {
    signOut(auth)
        .then(() => {
            alert("You have been signed out!");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        alert("You are authenticated with Google");
        console.log(user);
        const [firstName, lastName] = user.displayName.split(" ")

        const firstNameInput = document.getElementById("firstName");
        const lastNameInput = document.getElementById("lastName");
        firstNameInput.value = firstName || "";
        lastNameInput.value = lastName || "";
    }
});

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);
