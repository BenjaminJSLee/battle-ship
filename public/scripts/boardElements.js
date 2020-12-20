const createStatsElement = function() {
  const $stats = $(`
    <div class="stats">
      <div class="shots">
        <div class="hits">Hits: <span>0</span></div>
        <div class="misses">Misses: <span>0</span></div>
      </div>
    </div> 
  `);
  return $stats;
}

const createButton = function(action, txt = null) {
  return $(`<button class="${action}" data-button-id="${action}">${txt || action}</button>`);
};

const createBoardElement = function(rows, cols, id) {
  const $board = $(`
    <div data-id="board-${id}" class="game-board">
    </div>
  `);
  const $table = $(`<div class="table-body"></div>`);
  for(let i = 0; i < rows; i++) {
    const $row = $(`<div class="row"></div>`);
    for(let j = 0; j < cols; j++) {
      let newClass = `${(i === 0 ? "top" : i === rows - 1 ? "bottom" : "")}`;
      newClass = `${newClass ? newClass + " " : ""}${(j === 0 ? "left " : j === cols - 1 ? "right " : "")}tuple`;
      $row.append(`<div data-row="${i}" data-col="${j}" class="${newClass}"></div>`);
    }
    $table.append($row);
  }
  return $board.append($table);
};

const createGameElement = function(rows, cols) {
  const $gameStage = $(`<section id="stage"><div class="buttons"></div></section>`);

  const $gameContainer = $(`<div class="game-container"></div>`);
  const $shootingBoard = $(`<div data-board="attack" class="board-container"></div>`)
  $shootingBoard.append(createBoardElement(rows,cols,"shoot"));
  const $defendingBoard = $(`<div data-board="defend" class="board-container spotlight"></div>`)
  $defendingBoard.append(createBoardElement(rows,cols,"defend"));
  $gameContainer.append($shootingBoard).append($defendingBoard);

  $gameStage.prepend($gameContainer);
  $gameStage.prepend(createStatsElement());

  return $gameStage;
}
