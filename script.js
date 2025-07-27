const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");
const body = document.body;
const container = document.querySelector(".container");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let vsAI = false;

function createBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.dataset.index = index;
    cellElement.addEventListener("click", handleCellClick);
    boardElement.appendChild(cellElement);
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    statusElement.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameActive = false;
    setTimeout(() => smoothReset(true), 1500);
    return;
  }

  if (!board.includes("")) {
    statusElement.textContent = "It's a draw! Restarting...";
    gameActive = false;
    setTimeout(() => smoothReset(true), 1000);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusElement.textContent = `Player ${currentPlayer}'s turn`;

  if (vsAI && currentPlayer === "O") {
    setTimeout(aiMove, 600);
  }
}

function aiMove() {
  const emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = "O";
  document.querySelector(`[data-index='${randomIndex}']`).textContent = "O";

  if (checkWin("O")) {
    statusElement.textContent = "AI wins! 🤖";
    gameActive = false;
    setTimeout(() => smoothReset(true), 1500);
    return;
  }

  if (!board.includes("")) {
    statusElement.textContent = "It's a draw! Restarting...";
    gameActive = false;
    setTimeout(() => smoothReset(true), 1000);
    return;
  }

  currentPlayer = "X";
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winningCombos.some(combo => combo.every(index => board[index] === player));
}

function smoothReset(isAuto = false) {
  boardElement.classList.add("fade-out");
  setTimeout(() => {
    resetGame();
    boardElement.classList.remove("fade-out");
    boardElement.classList.add("fade-in");
    setTimeout(() => boardElement.classList.remove("fade-in"), 500);
    if (isAuto) statusElement.textContent = "New Game Started! Player X's turn";
  }, 500);
}

function resetGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  statusElement.textContent = `Player X's turn`;
  createBoard();
}

resetBtn.addEventListener("click", resetGame);

twoPlayerBtn.addEventListener("click", () => {
  vsAI = false;
  body.classList.remove("ai-mode");
  container.classList.remove("ai-mode");
  resetGame();
  statusElement.textContent = "2 Players Mode: Player X's turn";
});

aiBtn.addEventListener("click", () => {
  vsAI = true;
  body.classList.add("ai-mode");
  container.classList.add("ai-mode");
  resetGame();
  statusElement.textContent = "AI Mode: Player X's turn";
});

createBoard();
