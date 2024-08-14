document.addEventListener("DOMContentLoaded", () => {
    const words = ["JAVASCRIPT", "PYTHON", "HTML", "CSS", "REACT"];
    let word = "";
    const maxAttempts = 10;
    let attemptsLeft = maxAttempts;
    let guessedLetters = [];
    const wordDisplay = document.querySelector(".word-display");
    const attemptsLeftDisplay = document.querySelector(".attempts-left");
    const messageDisplay = document.querySelector(".message");
    const alphabetButtons = document.querySelectorAll(".letter-button");
    const restartButton = document.querySelector(".restart-button");
    const canvas = document.getElementById("hangmanCanvas");
    const context = canvas.getContext("2d");

    function initializeGame() {
        word = words[Math.floor(Math.random() * words.length)];
        attemptsLeft = maxAttempts;
        guessedLetters = [];
        wordDisplay.innerHTML = word
            .split("")
            .map(letter => `<span class="letter">_</span>`)
            .join("");
        attemptsLeftDisplay.textContent = attemptsLeft;
        messageDisplay.textContent = "Guess the word!";
        alphabetButtons.forEach(button => {
            button.disabled = false;
            button.classList.remove("correct", "incorrect");
        });
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function handleGuess(letter) {
        if (guessedLetters.includes(letter)) return;
        guessedLetters.push(letter);
        if (word.includes(letter)) {
            updateWordDisplay(letter);
            checkWin();
        } else {
            attemptsLeft--;
            attemptsLeftDisplay.textContent = attemptsLeft;
            drawHangman();
            checkLose();
        }
        disableButton(letter);
    }

    function updateWordDisplay(letter) {
        let display = word
            .split("")
            .map(l => (guessedLetters.includes(l) ? l : "_"))
            .join("");
        wordDisplay.innerHTML = display
            .split("")
            .map(l => `<span class="letter">${l}</span>`)
            .join("");

        // Animation for correct guesses
        if (word.includes(letter)) {
            word.split("").forEach((l, i) => {
                if (l === letter) {
                    const letterElement = wordDisplay.children[i];
                    letterElement.classList.add("correct-animation");
                    setTimeout(() => letterElement.classList.remove("correct-animation"), 500);
                }
            });
        }
    }

    function checkWin() {
        if (!wordDisplay.textContent.includes("_")) {
            messageDisplay.textContent = "You win!";
            disableAllButtons();
        }
    }

    function checkLose() {
        if (attemptsLeft === 0) {
            messageDisplay.textContent = `You lose! The word was ${word}`;
            disableAllButtons();
        }
    }

    function disableButton(letter) {
        let button = Array.from(alphabetButtons).find(button => button.textContent === letter);
        if (button) {
            button.disabled = true;
            button.classList.add(word.includes(letter) ? "correct" : "incorrect");

            // Animation for incorrect guesses
            if (!word.includes(letter)) {
                button.classList.add("incorrect-animation");
                setTimeout(() => button.classList.remove("incorrect-animation"), 500);
            }
        }
    }

    function disableAllButtons() {
        alphabetButtons.forEach(button => {
            button.disabled = true;
        });
    }

    function drawHangman() {
        const step = maxAttempts - attemptsLeft;
        context.strokeStyle = "#000";
        context.lineWidth = 2;
        switch(step) {
            case 1: context.strokeRect(50, 150, 100, 10); break; // Base
            case 2: context.beginPath(); context.moveTo(100, 150); context.lineTo(100, 50); context.stroke(); break; // Pole
            case 3: context.lineTo(150, 50); context.stroke(); break; // Top
            case 4: context.lineTo(150, 70); context.stroke(); break; // Rope
            case 5: context.beginPath(); context.arc(150, 85, 15, 0, Math.PI * 2); context.stroke(); break; // Head
            case 6: context.moveTo(150, 100); context.lineTo(150, 130); context.stroke(); break; // Body
            case 7: context.moveTo(150, 110); context.lineTo(130, 120); context.stroke(); break; // Left Arm
            case 8: context.moveTo(150, 110); context.lineTo(170, 120); context.stroke(); break; // Right Arm
            case 9: context.moveTo(150, 130); context.lineTo(130, 150); context.stroke(); break; // Left Leg
            case 10: context.moveTo(150, 130); context.lineTo(170, 150); context.stroke(); break; // Right Leg
        }
    }

    alphabetButtons.forEach(button => {
        button.addEventListener("click", () => handleGuess(button.textContent));
    });

    restartButton.addEventListener("click", initializeGame);

    initializeGame();
});