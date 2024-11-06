import { backend } from 'declarations/backend';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

let currentAttempt = 0;
let currentGuess = '';

const gameBoard = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');
const newGameBtn = document.getElementById('new-game-btn');
const messageElement = document.getElementById('message');

function createGameBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < WORD_LENGTH; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
}

function createKeyboard() {
    const keys = [
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
        'Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'
    ];

    keyboard.innerHTML = '';
    keys.forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.addEventListener('click', () => handleKeyInput(key));
        keyboard.appendChild(button);
    });
}

function handleKeyInput(key) {
    if (key === 'Enter') {
        if (currentGuess.length === WORD_LENGTH) {
            submitGuess();
        }
    } else if (key === 'Backspace') {
        currentGuess = currentGuess.slice(0, -1);
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
        currentGuess += key;
    }
    updateGameBoard();
}

async function submitGuess() {
    try {
        const result = await backend.validateGuess(currentGuess);
        if (result) {
            updateGameBoard(result);
            currentAttempt++;
            currentGuess = '';

            const [gameOver, attempts] = await backend.getGameStatus();
            if (gameOver) {
                if (attempts < MAX_ATTEMPTS) {
                    showMessage('Congratulations! You won!');
                } else {
                    showMessage('Game over. You ran out of attempts.');
                }
            }
        }
    } catch (error) {
        console.error('Error submitting guess:', error);
        showMessage('An error occurred. Please try again.');
    }
}

function updateGameBoard(result = null) {
    const row = gameBoard.children[currentAttempt];
    for (let i = 0; i < WORD_LENGTH; i++) {
        const cell = row.children[i];
        cell.textContent = currentGuess[i] || '';
        if (result) {
            cell.className = `cell ${getColorClass(result[i])}`;
        }
    }
}

function getColorClass(value) {
    switch (value) {
        case 2: return 'green';
        case 1: return 'yellow';
        default: return 'gray';
    }
}

function showMessage(text) {
    messageElement.textContent = text;
}

async function startNewGame() {
    try {
        await backend.newGame();
        currentAttempt = 0;
        currentGuess = '';
        createGameBoard();
        showMessage('');
    } catch (error) {
        console.error('Error starting new game:', error);
        showMessage('Failed to start a new game. Please try again.');
    }
}

newGameBtn.addEventListener('click', startNewGame);

document.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase();
    if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        handleKeyInput(key);
    }
});

createKeyboard();
startNewGame();
