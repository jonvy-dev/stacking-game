const levelDisplay = document.getElementById('level-display');
const stackElement = document.getElementById('stack');
const availablePiecesDiv = document.getElementById('available-pieces');
const statusElement = document.getElementById('status');
const nextLevelButton = document.getElementById('next-level-button');

let currentLevelIndex = 0;
let stack = [];
let availablePieces = {}; // Keep track of available pieces and their counts

const levels = [
    {
        pieces: [
            { durability: 60, weight: 50, name: 'Heavy', count: 2 },
            { durability: 100, weight: 30, name: 'Medium', count: 3 },
            { durability: 80, weight: 0, name: 'Zero', count: 1 }
        ]
    },
    {
        pieces: [
            { durability: 40, weight: 70, name: 'Very Heavy', count: 1 },
            { durability: 70, weight: 40, name: 'Slightly Heavy', count: 4 },
            { durability: 120, weight: 20, name: 'Light', count: 2 }
        ]
    },
    {
        pieces: [
            { durability: 90, weight: 35, name: 'Balanced', count: 3 },
            { durability: 50, weight: 60, name: 'Top Heavy', count: 2 },
            { durability: 150, weight: 10, name: 'Feather', count: 1 },
            { durability: 60, weight: 0, name: 'Zero 2', count: 1 }
        ]
    }
];

function loadLevel() {
    if (currentLevelIndex < levels.length) {
        const currentLevelData = levels[currentLevelIndex];
        levelDisplay.textContent = `Level: ${currentLevelIndex + 1}`;
        stack = [];
        availablePieces = {};
        availablePiecesDiv.innerHTML = ''; // Clear previous buttons
        statusElement.textContent = '';
        nextLevelButton.style.display = 'none';
        updateStackDisplay();

        for (const piece of currentLevelData.pieces) {
            availablePieces[piece.name] = { ...piece }; // Store a copy
            const button = document.createElement('button');
            button.classList.add('available-piece-button');
            button.textContent = `${piece.name} (D:${piece.durability}, W:${piece.weight}) x ${piece.count}`;
            button.onclick = () => addPieceToStack(piece.name);
            availablePiecesDiv.appendChild(button);
        }
    } else {
        statusElement.textContent = "Congratulations! You've completed all levels!";
        availablePiecesDiv.innerHTML = '';
        nextLevelButton.style.display = 'none';
    }
}

function addPieceToStack(pieceName) {
    if (availablePieces[pieceName] && availablePieces[pieceName].count > 0) {
        const pieceToAdd = {
            durability: availablePieces[pieceName].durability,
            weight: availablePieces[pieceName].weight,
            name: pieceName // Keep track of the name for updating count
        };
        stack.push(pieceToAdd);
        availablePieces[pieceName].count--;
        updateStackDisplay();
        updateAvailablePiecesDisplay();
        checkLevelCompletion();
    }
}

function updateAvailablePiecesDisplay() {
    availablePiecesDiv.innerHTML = '';
    for (const pieceName in availablePieces) {
        const piece = availablePieces[pieceName];
        const button = document.createElement('button');
        button.classList.add('available-piece-button');
        button.textContent = `${piece.name} (D:${piece.durability}, W:${piece.weight}) x ${piece.count}`;
        button.onclick = () => addPieceToStack(piece.name);
        button.disabled = piece.count === 0;
        availablePiecesDiv.appendChild(button);
    }
}

function calculateWeightOnPiece(index) {
    let totalWeight = 0;
    for (let i = index + 1; i < stack.length; i++) {
        totalWeight += stack[i].weight;
        if (i > 0 && stack[i].weight > stack[i - 1].weight + 20) {
            const extraWeight = Math.max(5, stack[i].weight - stack[i - 1].weight - 20);
            totalWeight += extraWeight;
        }
    }
    return totalWeight;
}

function checkStackStability() {
    let isStable = true;
    for (let i = 0; i < stack.length; i++) {
        const weightOnPiece = calculateWeightOnPiece(i);
        const pieceElement = stackElement.children[stack.length - 1 - i]; // Adjust index

        if (weightOnPiece > stack[i].durability) {
            isStable = false;
            if (pieceElement) {
                pieceElement.classList.add('broken');
            }
        } else if (pieceElement) {
            pieceElement.classList.remove('broken');
        }
    }
    return isStable;
}

function updateStackDisplay() {
    stackElement.innerHTML = '';
    for (const piece of stack) {
        const pieceDiv = document.createElement('div');
        pieceDiv.classList.add('piece');
        pieceDiv.textContent = `${piece.name} (D: ${piece.durability}, W: ${piece.weight})`;
        stackElement.appendChild(pieceDiv);
    }
    checkStackStability(); // Re-check stability after each update
}

function checkLevelCompletion() {
    let allPiecesUsed = true;
    for (const pieceName in availablePieces) {
        if (availablePieces[pieceName].count > 0) {
            allPiecesUsed = false;
            break;
        }
    }

    if (allPiecesUsed && checkStackStability() && stack.length > 0) {
        statusElement.textContent = "Level Completed!";
        nextLevelButton.style.display = 'block';
    } else if (allPiecesUsed && stack.length === 0 && currentLevelIndex < levels.length) {
        statusElement.textContent = "Use the available pieces to build a stable stack.";
    } else if (!checkStackStability() && allPiecesUsed && stack.length > 0) {
        statusElement.textContent = "The stack is unstable!";
    }
}

function nextLevel() {
    currentLevelIndex++;
    loadLevel();
}

nextLevelButton.addEventListener('click', nextLevel);

// Initial load of the first level
loadLevel();
