import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, get, child, remove, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get <ol> element
const olEl = document.getElementById("highscore-list");

// Function to fetch and display high scores
function printHighscores() {
  const scoresQuery = query(ref(db, "scores"), orderByChild("score"), limitToLast(10));

  get(scoresQuery).then((snapshot) => {
    if (snapshot.exists()) {
      const scoresArray = [];

      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;  // Get the key (player's name)
        const value = childSnapshot.val();  // Get the actual score and timestamp data

        // Push the score data into the array
        scoresArray.push({
          name: key, // player's name (key)
          ...value   // score and timestamp (value)
        });
      });

      // Sort in descending order
      scoresArray.sort((a, b) => b.score - a.score);

      // Clear existing list
      olEl.innerHTML = "";

      // Display top scores
      scoresArray.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${entry.name.toUpperCase()} - ${entry.score}`;
        olEl.appendChild(li);
      });
    } else {
      olEl.innerHTML = "<li>No scores found.</li>";
    }
  }).catch((error) => {
    console.error("Error fetching scores:", error);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const dbRef = ref(db, "scores");
      get(dbRef).then(() => {
        dbRef.remove();
        location.reload();
      });
    });
  }

  printHighscores();
});
