//repeated letter : say repeated and dont give extra points

let chosenWord;
let displayedWord;
let lives;
let score = 0;
const maxLives = 6;

// Canvas for drawing the stick figure
const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

// Hangman drawing stages based on the remaining lives
const drawHangman = (livesLeft) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas for a fresh drawing

    // Draw the base
    if (livesLeft < 6) {
        ctx.beginPath();
        ctx.moveTo(10, 290);
        ctx.lineTo(190, 290);
        ctx.stroke();
    }
    // Draw the pole
    if (livesLeft < 5) {
        ctx.beginPath();
        ctx.moveTo(50, 290);
        ctx.lineTo(50, 50);
        ctx.lineTo(150, 50);
        ctx.lineTo(150, 80);
        ctx.stroke();
    }
    // Draw the head
    if (livesLeft < 4) {
        ctx.beginPath();
        ctx.arc(150, 100, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    // Draw the body
    if (livesLeft < 3) {
        ctx.beginPath();
        ctx.moveTo(150, 120);
        ctx.lineTo(150, 200);
        ctx.stroke();
    }
    // Draw the left arm
    if (livesLeft < 2) {
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.lineTo(120, 180);
        ctx.stroke();
    }
    // Draw the right arm
    if (livesLeft < 1) {
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.lineTo(180, 180);
        ctx.stroke();
    }
    // Draw the legs
    if (livesLeft === 0) {
        ctx.beginPath();
        ctx.moveTo(150, 200);
        ctx.lineTo(120, 250);
        ctx.stroke();

        ctx.moveTo(150, 200);
        ctx.lineTo(180, 250);
        ctx.stroke();
    }
};

// Fetch random words from an external API
async function fetchRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await response.json();
        return data[0].toLowerCase(); // Get the first word and convert to lowercase
    } catch (error) {
        console.error('Error fetching word:', error);
        return 'javascript';  // Fallback word in case of error
    }
}

async function initializeGame() {
    chosenWord = await fetchRandomWord();
    displayedWord = Array(chosenWord.length).fill("_");
    lives = maxLives;
    drawHangman(lives);  // Initialize hangman canvas drawing
    updateDisplay();
}

function updateDisplay() {
    document.getElementById("word").innerHTML = displayedWord.join(" ");
    document.getElementById("lives").innerHTML = `Lives: ${lives}`;
    document.getElementById("score").innerHTML = `Score: ${score}`;
}

function guessLetter() {
    let input = document.getElementById("letter-input").value.toLowerCase();
    document.getElementById("letter-input").value = ""; // Clear input field

    if (input && input.length === 1) {
        if (chosenWord.includes(input)) {
            for (let i = 0; i < chosenWord.length; i++) {
                if (chosenWord[i] === input) {
                    displayedWord[i] = input;
                }
            }
            score += 10;
        } else {
            lives -= 1;
            drawHangman(lives);  // Update the hangman drawing as lives decrease
        }

        if (!displayedWord.includes("_")) {
            document.getElementById("message").innerHTML = "You won!";
        } else if (lives <= 0) {
            document.getElementById("message").innerHTML = `Game over! The word was ${chosenWord}`;
        } else {
            document.getElementById("message").innerHTML = "";
        }

        updateDisplay();
    } else {
        document.getElementById("message").innerHTML = "Please enter a valid letter!";
    }
}

function restartGame() {
    score = 0;
    document.getElementById("message").innerHTML = "";
    initializeGame();
}

// Initialize game on page load
window.onload = initializeGame;
