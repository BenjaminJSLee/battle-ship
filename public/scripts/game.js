const createGameBoard = function(rows, cols, id) {
  const $board = $(`
    <div id="board-${id}" class="game-board">
    </div>
  `);
  const $table = $(`<div class="table-body"></div>`);
  for(let i = 0; i < rows; i++) {
    const $row = $(`<div class="row"></div>`);
    for(let j = 0; j < cols; j++) {
      let newClass = `${(i === 0 ? "top" : i === rows - 1 ? "bottom" : "")}`;
      newClass = `${newClass ? newClass + " " : ""}${(j === 0 ? "left" : j === cols - 1 ? "right" : "")}`;
      $row.append(`<div data-row="${i}" data-col="${j}" class="${newClass}"></div>`);
    }
    $table.append($row);
  }
  return $board.append($table);
};

const addBoardListener = function($board, history = {}) {
  const boardShots = history;
  $board.on('click', function(evt) {
    const $tuple = $(evt.target);
    const row = $tuple.attr("data-row");
    const col = $tuple.attr("data-col");
    if (row === undefined || col === undefined) return;
    if (boardShots[row] && boardShots[row][col]) return;
    $('.row div').removeClass('selected');
    $tuple.addClass('selected');
    $("#fire-button").attr("data-row", row).attr("data-col", col);
  });
  return boardShots;
};

const addFireListener = function($button, boardShots) {
  $button.on("click", function() {
    const $fire = $button;
    const row = $fire.attr("data-row");
    const col = $fire.attr("data-col");
    if (col === undefined || row === undefined) return;
    if (boardShots[row] && boardShots[row][col]) return;
    if (boardShots[row] === undefined) boardShots[row] = { [col]: true };
    else boardShots[row][col] = true;
    $(`#board-shoot .row div[data-row="${row}"][data-col="${col}"]`).text("X");
  });
};

const createButtons = function(boardShots) {
  const $buttons = $(`<div class="buttons"></div>`);
  const $fire = $(`<button id="fire-button">FIRE</button>`);
  addFireListener($fire, boardShots)
  $buttons.prepend($fire);
  $buttons.append(`<div class="button-container"><button id="marker-button">MARKER</button></div>`);
  return $buttons;
}

const createStats = function() {
  const $stats = $(`
    <div id="pooplol" class="stats" draggable="true" style="width: 10px; height: 10px">
      <div class="ships"></div>
      <div class="shots">
        <div class="hits">Hits: <span>0</span></div>
        <div class="misses">Misses: <span>0</span></div>
      </div>
    </div> 
  `);
  $stats.on('dragstart', function(evt) {
    console.log(evt.target.id);
    evt.dataTransfer.setData("text", evt.target.id);
    evt.dataTransfer.dropEffect = "move";
  });
  return $stats;
}

const createGame = function({rows, cols}) {
  const $gameStage = $(`<section id="stage"></section>`);
  const $gameContainer = $(`<div class="game-container"></div>`);
  const $shootingBoard = $(`<div class="board-container spotlight"></div>`).append(createGameBoard(rows,cols,"shoot"));
  const $defendingBoard = $(`<div class="board-container"></div>`).append(createGameBoard(rows,cols,"defend"));
  $defendingBoard.on('drop', function(evt) {
    evt.preventDefault();
    const data = evt.dataTransfer.getData("text");
    console.log(data);
    evt.target.appendChild(document.getElementById(data));
  });
  $defendingBoard.on('dragover', function(evt) {
    evt.preventDefault();
    if (evt.target !== this) evt.target.innerHTML = "W";
  })
  const boardShots = addBoardListener($shootingBoard);
  $gameContainer.append($shootingBoard).append($defendingBoard);
  $gameStage.append(createStats());
  $gameStage.append($gameContainer);
  $gameStage.append(createButtons(boardShots));
  return $gameStage;
};
