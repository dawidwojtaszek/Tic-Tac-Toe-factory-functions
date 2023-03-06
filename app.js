function Gameboard() {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;
  const setXO = (x, y, player) => {
    board[x][y].setValue(player);
  };

  //  Board with tokens
  const getBoardWithTokens = () => {
    let boardWitaTokens = board.map((row) =>
      row.map((cell) => {
        if (cell.getValue().token !== undefined) {
          return cell.getValue().token;
        } else {
          return 0;
        }
      })
    );
    return boardWitaTokens;
  };

  const checkIsWin = () => {
    const boardToken = getBoardWithTokens();

    let winner = null;

    // horizontal
    for (let i = 0; i < 3; i++) {
      let counter = 0;
      let currentE = boardToken[i][0];

      for (let j = 0; j < 3; j++) {
        if (currentE === boardToken[i][j] && boardToken[i][j] != 0) {
          counter++;
        }
      }
      if (counter === 3) {
        winner = { player: currentE, type: "row", nr: i };
      } else {
        counter = 0;
      }
    }

    // vertical
    for (let i = 0; i < 3; i++) {
      let counter = 0;

      let currentE = boardToken[0][i];
      for (let j = 0; j < 3; j++) {
        if (currentE === boardToken[j][i] && boardToken[j][i] != 0) {
          counter++;
        }
      }
      if (counter === 3) {
        winner = { player: currentE, type: "col", nr: i };
      } else {
        counter = 0;
      }
    }

    //diagonals
    let diagonalCounterL = 0;
    let diagonalCounterR = 0;
    for (let i = 0; i < 3; i++) {
      let currentE = boardToken[0][0];
      let currentER = boardToken[0][2];
      for (let j = 0; j < 3; j++) {
        if (j === i) {
          if (currentE === boardToken[j][i] && boardToken[j][i] != 0) {
            diagonalCounterL++;
          }
        }
        if (i + j === 2) {
          if (currentER === boardToken[j][i] && boardToken[j][i] != 0) {
            diagonalCounterR++;
          }
        }
      }
    }
    if (diagonalCounterL === 3) {
      winner = { player: boardToken[0][0], type: "dia", nr: 1 };
    } else {
      diagonalCounterL = 0;
    }
    if (diagonalCounterR === 3) {
      winner = { player: boardToken[0][2], type: "dia", nr: 2 };
    } else {
      diagonalCounterR = 0;
    }

    return winner;
  };

  const printBoard = () => {
    let boardToPrint = board.map((row) =>
      row.map((cell) => cell.getValue().token)
    );
    console.log(boardToPrint);
  };

  return {
    getBoard,
    setXO,
    printBoard,
    checkIsWin,
    getBoardWithTokens,
  };
}

function Cell() {
  let value = 0;
  const setValue = (player) => (value = player);
  const getValue = () => value;

  return { setValue, getValue };
}

function GameControll(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];
  let round = 1;
  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;
  const resetGame = () => {
    window.location.reload();
  };

  const changeActivePlayer = () => {
    activePlayer === players[0]
      ? (activePlayer = players[1])
      : (activePlayer = players[0]);
  };
  const getRound = () => round;

  const playRound = (x, y) => {
    board.setXO(x - 1, y - 1, activePlayer);
    ui.renderBoard(board.getBoardWithTokens(board.getBoardWithTokens()));
    changeActivePlayer();
    if (round > 4) {
      let result = board.checkIsWin();
      if (result != null) {
        ui.gameOverView(result);
      }
    }
    if (round === 9 && board.checkIsWin() === null) {
      ui.gameOverView(null);
    }
    ui.renderUiELements();
    round++;
  };

  return { playRound, getRound, resetGame, getActivePlayer };
}

function UiControll() {
  const game = GameControll();
  const renderBoard = (boardToRender) => {
    console.log(boardToRender);
    const gameBoardElement = document.getElementById("gameBoard");
    gameBoardElement.innerHTML = "";
    boardToRender.forEach((row, index) => {
      const rowElement = document.createElement("div");
      rowElement.classList = "row";
      rowElement.dataset.row = index;

      row.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList = "cell";
        cellElement.dataset.col = index;
        if (cell != 0) {
          const imgElement = document.createElement("img");
          if (cell === 1) {
            imgElement.src = "./images/x-solid.svg";
            cellElement.appendChild(imgElement);
            cellElement.classList.add("lock");
          } else {
            imgElement.src = "./images/circle-regular.svg";
            cellElement.appendChild(imgElement);
            cellElement.classList.add("lock");
          }
        }
        rowElement.appendChild(cellElement);
      });
      gameBoardElement.appendChild(rowElement);
    });
    const cellsElements = document.querySelectorAll(".cell");
    cellsElements.forEach((e) => {
      e.addEventListener("click", (e) => {
        game.playRound(
          parseInt(e.target.parentElement.dataset.row) + 1,
          parseInt(e.target.dataset.col) + 1
        );
      });
    });
  };
  const winningCells = (type, nr) => {
    const line = document.querySelectorAll(`[data-${type}]`);
    if (type !== "dia") {
      line.forEach((element) => {
        if (parseInt(element.dataset[`${type}`]) === nr) {
          element.classList.add("winning-cell");
        }
      });
    } else if (nr === 1) {
      const first = document.querySelector(".cell");
      const secound = document.querySelector('[data-row="1"] :nth-child(2)');
      const third = document.querySelector('[data-row="2"] :nth-child(3)');
      first.classList.add("winning-cell");
      secound.classList.add("winning-cell");
      third.classList.add("winning-cell");
    } else if (nr === 2) {
      const first = document.querySelector('[data-row="0"] :nth-child(3)');
      const secound = document.querySelector('[data-row="1"] :nth-child(2)');
      const third = document.querySelector('[data-row="2"] :first-child');
      first.classList.add("winning-cell");
      secound.classList.add("winning-cell");
      third.classList.add("winning-cell");
    }
  };
  const gameOverView = (result) => {
    const boardElement = document.getElementById("gameBoard");
    const resultElement = document.getElementById("result-element");
    const turnElement = document.getElementById("turn-element");
    boardElement.classList.add("lock");
    boardElement.classList.add("game-over");
    if (result != null) {
      winningCells(result.type, result.nr);
      resultElement.innerText = `Player ${result.player} is a winer!`;
      turnElement.innerHTML = "";
    } else {
      resultElement.innerText = `TIE`;
    }
  };
  const renderUiELements = () => {
    const turnElement = document.getElementById("turn-element");
    turnElement.innerText = `${game.getActivePlayer().name} turn `;
  };
  return { renderBoard, gameOverView, renderUiELements };
}

const game = GameControll();
const ui = UiControll();
const board = Gameboard();
ui.renderBoard(board.getBoardWithTokens());
ui.renderUiELements();
