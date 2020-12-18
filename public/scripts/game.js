
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

const getSetUpHandlers = function({ $game, rows, cols }, ships, transition) {
  const events = [];
  let curShip = null;
  const shipClickHandler = function(evt) {
    const $target = $(evt.target);
    const shipId = $target.attr(`data-ship-id`);
    if (shipId === undefined) return;
    if (curShip === ships[shipId]) rotateShip(ship, rows, cols);
  };
  events.push({ $target: $game.find(``), type: "click", handler: shipClickHandler});

  const boardClickHandler = function(evt) {
    const $target = $(evt.target);

  };
  events.push({ $target: $game.find(``), type: "click", handler: boardClickHandler});

  const boardHoverHandler = function(evt) {
    const $target = $(evt.target);

  };
  events.push({ $target: $game.find(``), type: "mouseover", handler: boardHoverHandler});
  
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
