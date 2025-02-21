var playing = false;
var score;
var action;
var timeremaining;
var correctAnswer;
var difficulty = 'easy'; // Default difficulty level
var highScore = localStorage.getItem('highScore') || 0;
var username;

document.getElementById("startreset").onclick = function() {
    username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter a username to start the game.");
        return;
    }
    if (playing == true) {
        location.reload(); 
    } else {
        playing = true;
        score = 0;
        document.getElementById("scorevalue").innerHTML = score;
        show("timeremaining");
        timeremaining = 60;
        document.getElementById("timeremainingvalue").innerHTML = timeremaining;
        hide("gameOver");
        document.getElementById("startreset").innerHTML = "Reset Game";
        startCountdown();
        generateQA();
    }
};

document.getElementById("easy").onclick = function() { setDifficulty('easy'); };
document.getElementById("medium").onclick = function() { setDifficulty('medium'); };
document.getElementById("hard").onclick = function() { setDifficulty('hard'); };

function setDifficulty(level) {
    difficulty = level;
    alert("Difficulty set to " + level.charAt(0).toUpperCase() + level.slice(1));
}

for (let i = 1; i <= 4; i++) {
    document.getElementById("box" + i).onclick = function() {
        if (playing === true) {
            if (this.innerHTML == correctAnswer) {
                score++;
                document.getElementById("scorevalue").innerHTML = score;
                changeBackgroundColor('green'); // Change background to green
                hide("wrong");
                show("correct");
                document.getElementById("correct").classList.add("show", "correct");
                setTimeout(function() {
                    document.getElementById("correct").classList.remove("show", "correct");
                    resetBackgroundColor(); // Reset the background color
                }, 1000);
                generateQA();
            } else {
                changeBackgroundColor('red'); // Change background to red
                hide("correct");
                show("wrong");
                document.getElementById("wrong").classList.add("show", "wrong");
                setTimeout(function() {
                    document.getElementById("wrong").classList.remove("show", "wrong");
                    resetBackgroundColor(); // Reset the background color
                }, 1000);
            }
        }
    };
}

function startCountdown() {
    action = setInterval(function() {
        timeremaining -= 1;
        document.getElementById("timeremainingvalue").innerHTML = timeremaining;
        if (timeremaining === 0) { 
            stopCountdown();
            show("gameOver");
            document.getElementById("gameOver").innerHTML = "<p>Game over!</p><p>Your score is " + score + ".</p>";
            hide("timeremaining");
            hide("correct");
            hide("wrong");
            playing = false;
            document.getElementById("startreset").innerHTML = "Start Game";
            checkHighScore();
            displayLeaderboard(); // Display leaderboard after game
        }
    }, 1000);
}

function stopCountdown() {
    clearInterval(action);
}

function hide(Id) {
    document.getElementById(Id).style.display = "none";
}
function show(Id) {
    document.getElementById(Id).style.display = "block";
}

function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

function resetBackgroundColor() {
    document.body.style.backgroundColor = "#f0f0f0"; // Reset to original color
}

function checkHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById("gameOver").innerHTML += "<p>New High Score: " + highScore + "!</p>";
    }
    saveScore(username, score);
}

function saveScore(username, score) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ username, score });
    scores.sort((a, b) => b.score - a.score); // Sort in descending order
    localStorage.setItem('scores', JSON.stringify(scores.slice(0, 10))); // Keep only top 10
}

function displayLeaderboard() {
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = ''; // Clear current scores
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = `${entry.username}: ${entry.score}`;
        scoreList.appendChild(li);
    });
}

function generateQA() {
    let range;
    if (difficulty === 'easy') {
        range = 5;
    } else if (difficulty === 'medium') {
        range = 10;
    } else { // hard
        range = 15;
    }

    var x = 1 + Math.round((range - 1) * Math.random());
    var y = 1 + Math.round((range - 1) * Math.random());
    correctAnswer = x * y;
    document.getElementById("question").innerHTML = x + " x " + y;
    var correctPosition = 1 + Math.round(3 * Math.random());
    document.getElementById("box" + correctPosition).innerHTML = correctAnswer;

    var answers = [correctAnswer];
    for (let i = 1; i <= 4; i++) {
        if (i !== correctPosition) {
            var wrongAnswer;
            do {
                wrongAnswer = (1 + Math.round((range - 1) * Math.random())) * (1 + Math.round((range - 1) * Math.random())); 
            } while (answers.indexOf(wrongAnswer) > -1);
            document.getElementById("box" + i).innerHTML = wrongAnswer;
            answers.push(wrongAnswer);
        }
    }
}