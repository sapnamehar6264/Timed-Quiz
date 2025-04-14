import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBoT6W5QGV1vSmctAUgHaVRbRmx8yWP9gs",
  authDomain: "quiz-game-f9c2a.firebaseapp.com",
  databaseURL: "https://quiz-game-f9c2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quiz-game-f9c2a",
  storageBucket: "quiz-game-f9c2a.appspot.com",
  messagingSenderId: "176614396409",
  appId: "1:176614396409:web:e089daf691e45ea321ed28",
  measurementId: "G-QW7TQ6S69J"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Function to fetch and display high scores
function printHighscores() {
  const scoresRef = db.ref("scores");

  scoresRef.orderByChild("score").limitToLast(10).once("value", (snapshot) => {
    const data = snapshot.val();
    const olEl = document.getElementById("highscores");
    const scoresArray = [];

    for (let key in data) {
      scoresArray.push(data[key]);
    }

    // Sort in descending order based on score
    scoresArray.sort((a, b) => b.score - a.score);

    // Clear the leaderboard before displaying new data
    olEl.innerHTML = "";

    // Display top 10 scores
    scoresArray.forEach((score, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${score.name} - ${score.score}`;
      olEl.appendChild(li);
    });
  });
}

// Clear the leaderboard in Firebase when the user clicks "Clear Highscores"
document.getElementById("clear").onclick = () => {
  db.ref("scores").remove();
  location.reload();  // Reload page to reflect changes
};

// Fetch and display high scores when the page loads
printHighscores();

