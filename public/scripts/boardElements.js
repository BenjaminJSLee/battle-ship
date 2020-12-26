const addLogMsg = function($target, msg) {
  $target.append(`
    <div class="message">${msg}</div>
  `);
  $target.scrollTop($target[0].scrollHeight);
};

const createLog = function(msg = "Welcome to battleship!") {
  const $log = $(`<div data-id="log" class="log"></div>`);
  addLogMsg($log, msg);
  return $log;
};

const createButton = function(action, txt = null) {
  return $(`<button class="${action}" data-button-id="${action}">${txt || action}</button>`);
};

const createStatsElement = function() {
  const $log = createLog();
  const $rotate = createButton("rotate", `<i class="fas fa-sync-alt"></i>`);
  const $save = createButton("save");
  const $buttons = $(`<div class="buttons"></div>`).append($rotate, $save);
  const $stats = $(`<div class="stats"></div>`);
  $stats.append($log, $buttons);
  return $stats;
}

const createBoardElement = function(rows, cols, id) {
  const $board = $(`
    <div data-board="${id}" class="game-board">
    </div>
  `);
  const $table = $(`<div class="table-body"></div>`);
  const $xAxis = $(`<div class="row" ><div class="axis-label"></div></div>`);
  for(let i = 0; i < rows; i++) {
    $xAxis.append(`<div class="axis-label" >${String.fromCharCode('A'.charCodeAt(0) + i)}</div>`);
  }
  $table.append($xAxis);
  for(let i = 0; i < rows; i++) {
    const $row = $(`<div class="row"></div>`);
    $row.append(`<div class="axis-label" >${i+1}</div>`);
    for(let j = 0; j < cols; j++) {
      let newClass = `${(i === 0 ? "top" : i === rows - 1 ? "bottom" : "")}`;
      newClass = `${newClass ? newClass + " " : ""}${(j === 0 ? "left " : j === cols - 1 ? "right " : "")}tuple`;
      $row.append(`<div data-row="${i}" data-col="${j}" class="${newClass}"></div>`);
    }
    $table.append($row);
  }
  return $board.append($table);
};

const createGameElement = function(rows, cols, players) {
  const $gameStage = $(`<section id="stage"></section>`);

  const $gameContainer = $(`<div class="game-container"></div>`);
  for (let i = 0; i < players; i++) {
    const $boardContainer = $(`<div class="board-container"></div>`).append(createBoardElement(rows,cols,i));
    $gameContainer.append($boardContainer);
  }

  $gameStage.prepend($gameContainer);
  $gameStage.prepend(createStatsElement());

  return $gameStage;
}
