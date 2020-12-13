const createGameBoard = function(rows, cols, boardNum) {
  const $board = $(`
    <div id="board-${boardNum}" class="game-board">
    </div>
  `);
  for(let i = 0; i < rows; i++) {
    const $row = $(`<div class="row"></div>`);
    for(let j = 0; j < cols; j++) {
      let newClass = `${(i === 0 ? "top" : i === rows - 1 ? "bottom" : "")}`;
      newClass = `${newClass ? newClass + " " : ""}${(j === 0 ? "left" : j === cols - 1 ? "right" : "")}`;
      $row.append(`<div data-id="${j} ${i}" class="${newClass}"></div>`);
    }
    $board.append($row);
  }
  return $board;
};

const createGame = function({boards, rows, cols}) {
  const $boards = [];
  const $gameStage = $(`
    <section id="stage">
      <div class="buttons">
        <div class="button-container"><button id="fire-button">FIRE</button></div>
        <div class="button-container"><button id="marker-button">MARKER</button></div>
      </div>
    </section>
  `);
  const $gameContainer = $(`<div class="game-container"></div>`);
  for (let i = 0; i < boards; i++) {
    const $boardContainer = $(`<div class="board-container"></div>`);
    const $board = $boardContainer.append(createGameBoard(rows,cols,i));
    $boards.push($board);
    $gameContainer.append($boards[i]);
  }
  $gameStage.prepend($gameContainer);
  return $gameStage;
};

$( function() {
  

  $('body').append(createGame({rows: 5, cols: 5, boards: 2}));
});