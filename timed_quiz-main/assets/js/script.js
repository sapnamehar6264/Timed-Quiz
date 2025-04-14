
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



// // List of Questions and Answers
// var questions = [
//     {
//         prompt: "Inside which HTML element do we put the JavaScript?",
//         options: ["<javascript>", "<js>", "<script>", "<scripting>"],
//         answer: "<script>"
//     },

//     {
//         prompt: "How do you call a function named myFunction?",
//         options: ["call myFunction()", "myFunction()", "call function myFunction", "Call.myFunction"],
//         answer: "myFunction()"
//     },

//     {
//         prompt: "How does a for loop start?",
//         options: ["for (i = 0; i <= 5; i++)", "for (i = 0; i <= 5)", "for i = 1 to 5", " for (i <= 5; i++)"],
//         answer: "for (i = 0; i <= 5; i++)"
//     },

//     {
//         prompt: "In JavaScript, which of the following is a logical operator?",
//         options: ["|", "&&", "%", "/"],
//         answer: "&&"
//     },

//     {
//         prompt: "A named element in a JavaScript program that is used to store and retrieve data is a _____.",
//         options: ["method", "assignment operator", "variable", "string"],
//         answer: "variable"
//     }
// ];

let questions = [];

// Fetch programming questions from the API
async function fetchQuestions() {
  try {
    const res = await fetch('https://opentdb.com/api.php?amount=5&category=18&type=multiple'); // Programming category
    const data = await res.json();

    // Transform API data to match your existing structure
    questions = data.results.map(q => {
      const allAnswers = [...q.incorrect_answers];
      const randomIndex = Math.floor(Math.random() * (allAnswers.length + 1));
      allAnswers.splice(randomIndex, 0, q.correct_answer);

      return {
        prompt: decodeHTML(q.question),
        options: allAnswers.map(opt => decodeHTML(opt)),
        answer: decodeHTML(q.correct_answer)
      };
    });

    quizStart(); // Start quiz after fetching
  } catch (error) {
    console.error("Error fetching questions:", error);
    alert("Could not load questions. Try again later.");
  }
}

// Helper to decode HTML entities
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Get Dom Elements
var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#timer");
var choicesEl = document.querySelector("#options");
var submitBtn = document.querySelector("#submit-score");
var startBtn = document.querySelector("#start");
var nameEl = document.querySelector("#name");
var feedbackEl = document.querySelector("#feedback");
var reStartBtn = document.querySelector("#restart");

// Quiz's initial state
var currentQuestionIndex = 0;
var time = 60; // Set timer to 60 seconds
var timerId;

// Start quiz and hide frontpage
function quizStart() {
    timerId = setInterval(clockTick, 1000);
    timerEl.textContent = time;
    var landingScreenEl = document.getElementById("start-screen");
    landingScreenEl.setAttribute("class", "hide");
    questionsEl.removeAttribute("class");
    getQuestion();
}

// Loop through array of questions and answers and create list with buttons
function getQuestion() {
    var currentQuestion = questions[currentQuestionIndex];
    var promptEl = document.getElementById("question-words");
    promptEl.textContent = currentQuestion.prompt;
    choicesEl.innerHTML = "";
    currentQuestion.options.forEach(function(choice, i) {
        var choiceBtn = document.createElement("button");
        choiceBtn.setAttribute("value", choice);
        choiceBtn.textContent = i + 1 + ". " + choice;
        choiceBtn.onclick = questionClick;
        choicesEl.appendChild(choiceBtn);
    });
}

// Global variable to store the score
let score = 0;

// Check for correct answers and update the score (time) accordingly
function questionClick() {
    if (this.value !== questions[currentQuestionIndex].answer) {
      // Incorrect answer - deduct 1 second from time
      time -= 1;
      if (time < 0) {
        time = 0;
      }
      timerEl.textContent = time;
      feedbackEl.textContent = `Wrong! The correct answer was ${questions[currentQuestionIndex].answer}.`;
      feedbackEl.style.color = "red";
    } else {
      // Correct answer - add 5 points to score
      score += 5;
      feedbackEl.textContent = "Correct!";
      feedbackEl.style.color = "green";
    }

    feedbackEl.setAttribute("class", "feedback");
    setTimeout(function() {
      feedbackEl.setAttribute("class", "feedback hide");
    }, 2000);

    currentQuestionIndex++;
    if (currentQuestionIndex === questions.length) {
      quizEnd();  // End quiz when all questions are answered
    } else {
      getQuestion();  // Load next question
    }
}

// Ensure quiz timer is ticking down
function clockTick() {
    time--;
    timerEl.textContent = time;
    if (time <= 0) {
      quizEnd();  // End quiz when time runs out
    }
}

function quizEnd() {
    clearInterval(timerId);
    var endScreenEl = document.getElementById("quiz-end");
    endScreenEl.removeAttribute("class");

    // Display final score and time remaining
    var finalScoreEl = document.getElementById("score-final");
    finalScoreEl.textContent = `Score: ${score} | Time remaining: ${time} seconds`; // Display score and remaining time
    questionsEl.setAttribute("class", "hide");
}

// Save the score to Firebase
function saveHighscore() {
    const name = nameEl.value.trim();
    if (name !== "") {
        const newScore = {
            name: name,
            score: score,  // Store the actual score
            timestamp: Date.now()
        };

        firebase.database().ref("scores").push(newScore);
        alert("Score submitted!");
    }
}


// Save user's score after pressing enter
function checkForEnter(event) {
    if (event.key === "Enter") {
        saveHighscore();
    }
}
nameEl.onkeyup = checkForEnter;

// Save user's score after clicking submit
submitBtn.onclick = saveHighscore;

// Start quiz after clicking start quiz
startBtn.onclick = fetchQuestions;