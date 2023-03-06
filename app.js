function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  const resetBoard = () => {
    board = [];
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };
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
        winner = currentE;
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
        winner = currentE;
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
      winner = boardToken[0][0];
    } else {
      diagonalCounterL = 0;
    }
    if (diagonalCounterR === 3) {
      winner = boardToken[0][2];
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
    resetBoard,
  };
}

function Cell() {
  let value = 0;
  const setValue = (player) => (value = player);
  const getValue = () => value;

  return { setValue, getValue };
}

function UiControll() {
  const renderBoard = (boardToRender) => {
    console.log(boardToRender);
    const gameBoardElement = document.getElementById("gameBoard");
    gameBoardElement.innerHTML = "";
    boardToRender.forEach((row) => {
      const rowElement = document.createElement("div");
      rowElement.classList = "row";
      row.forEach((cell) => {
        const cellElement = document.createElement("div");
        cellElement.classList = "cell";
        console.log(cell);
        if (cell != 0) {
          const imgElement = document.createElement("img");
          if (cell === 1) {
            imgElement.src = "./images/x-solid.svg";
            cellElement.appendChild(imgElement);
          } else {
            imgElement.src = "./images/circle-regular.svg";
            cellElement.appendChild(imgElement);
          }
        }
        rowElement.appendChild(cellElement);
      });
      gameBoardElement.appendChild(rowElement);
    });
  };
  return { renderBoard };
}

function GameControll(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  const ui = UiControll();
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
    round = 1;
    activePlayer = players[0];
    board.resetBoard();
  };

  const changeActivePlayer = () => {
    activePlayer === players[0]
      ? (activePlayer = players[1])
      : (activePlayer = players[0]);
  };
  const getRound = () => round;

  const playRound = (x, y) => {
    console.log("round:", getRound(), activePlayer.name);
    console.log(board.getBoard());
    board.setXO(x - 1, y - 1, activePlayer);
    board.printBoard();
    ui.renderBoard(board.getBoardWithTokens(board.getBoardWithTokens()));
    changeActivePlayer();
    console.log(board.checkIsWin());
    round++;
  };

  return { playRound, getRound, resetGame, getActivePlayer };
}

const game = GameControll();
const ui = UiControll();
const board = Gameboard();
ui.renderBoard(board.getBoardWithTokens());
