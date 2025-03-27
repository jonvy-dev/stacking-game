const stackElement = document.getElementById('stack');
const statusElement = document.getElementById('status');
let stack = [];

function addPiece(piece) {
    stack.push(piece);
    updateStackDisplay();
    checkStackStability();
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
        const pieceElement = stackElement.children[stack.length - 1 - i]; // Adjust index for bottom-up display

        if (weightOnPiece > stack[i].durability) {
            isStable = false;
            if (pieceElement) {
                pieceElement.classList.add('broken');
            }
        } else if (pieceElement) {
            pieceElement.classList.remove('broken');
        }
    }

    if (isStable) {
        statusElement.textContent = "Stack is currently stable.";
    } else {
        statusElement.textContent = "Stack is unstable! Some pieces have broken.";
    }
}

function updateStackDisplay() {
    stackElement.innerHTML = '';
    for (const piece of stack) {
        const pieceDiv = document.createElement('div');
        pieceDiv.classList.add('piece');
        pieceDiv.textContent = `D: ${piece.durability}, W: ${piece.weight}`;
        stackElement.appendChild(pieceDiv);
    }
    checkStackStability(); // Re-check stability after each update
}

// Initial display (empty stack)
updateStackDisplay();
