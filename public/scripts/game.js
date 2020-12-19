
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
    $(`#board-shoot .row div[data-row="${row}"][data-col="${col}"]`).removeClass('selected').text("X");
  });
};




const startCombat = function({ $game, rows, cols }, ships, transition) {
  
};

const adjustForBounds = function(point, max, len) {
  if (point < 0) {
    return 0;
  } else if (point + len >= max) {
    return point - (point + len - max);
  }
  return point;
}

const getAdjustedPos = function(isVert, len, {row, col}, {rows, cols}) {
  const center = Math.floor(len/2);
  if (isVert) {
    return adjustForBounds(row - center, rows, len)
  } else { 
    return adjustForBounds(col - center, cols, len)
  }
}

const getSetUpHandlers = function({ $game, rows, cols }, ships, transition) {
  const events = [];
  let curShip = null;
  let isVert = true;
  const shipClickHandler = function(evt) {
    const $target = $(this);
    const shipId = $target.attr(`data-ship-id`);
    if (shipId === undefined) return;
    if (curShip === shipId) {
      isVert = !isVert;
    }
    curShip = shipId;
  };
  events.push({ $target: $game.find(`[data-ship-id]`), type: "click", handler: shipClickHandler});

  const boardClickHandler = function(evt) {
    if (!ships[curShip]) return;
    let ship = ships[curShip];
    if (isVert && ship.length > rows) return;
    if (!isVert && ship.length > cols) return;
    const $target = $(evt.target);
    const row = Number($target.attr(`data-row`));
    const col = Number($target.attr(`data-col`));
    if (Number.isNaN(row) || Number.isNaN(col)) return;
    const $board = $(this);
    $board.find(`.hover`).removeClass("hover");
    const shipStart = getAdjustedPos(isVert, ship.length, {row, col}, {rows, cols});
    for(let i = shipStart; i < shipStart + ship.length; i++) {
      $board
        .find(`[data-${isVert ? "row" : "col"}=${i}][data-${!isVert ? `row=${row}` : `col=${col}`}]`)
        .addClass("selected");
    }

  };
  events.push({ $target: $game.find(`[data-board="defend"]`), type: "click", handler: boardClickHandler});

  const boardHoverHandler = function(evt) {
    if (!ships[curShip]) return;
    let ship = ships[curShip];
    const $target = $(evt.target);
    const row = Number($target.attr(`data-row`));
    const col = Number($target.attr(`data-col`));
    if (Number.isNaN(row) || Number.isNaN(col)) return;
    const $board = $(this);
    $board.find(`.hover`).removeClass("hover");
    const shipStart = getAdjustedPos(isVert, ship.length, {row, col}, {rows, cols});
    for(let i = shipStart; i < shipStart + ship.length; i++) {
      $board
        .find(`[data-${isVert ? "row" : "col"}=${i}][data-${!isVert ? `row=${row}` : `col=${col}`}]`)
        .addClass("hover");
    }
  };
  events.push({ $target: $game.find(`[data-board="defend"]`), type: "mouseover", handler: boardHoverHandler});
  
  const boardSubmitHandler = function(evt) {
    const $target = $(evt.target);

  };
  events.push({ $target: $game.find(``), type: "click", handler: boardSubmitHandler});

  return events;
}

const getGameHandlers = function({ $game, rows, cols }, ships, transition) {

}

const setEventHandlers = function(events) {
  for (const event of events) {
    event.$target.on(event.type, event.handler);
  }
}

const removeEventHandlers = function(events) {
  for (const event of events) {
    event.$target.off(event.type, event.handler);
  }
}

const setupPhase = function(game, ships) {
  const SETUP = "SETUP";
  const CLEANUP = "CLEANUP";
  const START = "START";
  const RESTART = "RESTART";
  let events = [];
  const transition = function(phase) {
    if (phase === SETUP) setEventHandlers(events);
    else if(phase === CLEANUP) removeEventHandlers(events);
    else if(phase === START) {
      removeEventHandlers(events);
      events = startCombat(game, ships, this);
    } else if (phase === RESTART) {
      removeEventHandlers(events);
      events = getSetUpHandlers(game, ships, this);
      transition(SETUP);
    }
  };
  transition(RESTART);
};

const createGame = function({rows, cols}) {
  const { $ships, ships } = setupShips();
  const $game = createGameElement(rows, cols);
  $game.find(`div.stats`).prepend($ships);

  setupPhase({ $game, rows, cols }, ships);

  return $game;
};
