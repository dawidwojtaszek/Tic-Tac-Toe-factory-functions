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
  const getBoard = () => board;
  const setXO = (x, y, player) => {
    board[x][y].setValue(player);
  };
  //   print to console
  const printBoard = () => {
    let boardToPrint = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardToPrint);
  };

  return { getBoard, setXO, printBoard };
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

  let activePlayer = players[0];

  const changeActivePlayer = () => {
    activePlayer === players[0]
      ? (activePlayer = players[1])
      : (activePlayer = players[0]);
  };

  const playRound = (x, y) => {
    board.setXO(x - 1, y - 1, activePlayer);
    board.printBoard();
    changeActivePlayer();
  };

  return { playRound };
}

const game = GameControll();
