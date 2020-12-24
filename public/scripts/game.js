
const getCombatHandlers = function({ $game, rows, cols }, {id, shots, ships}, transition) {
  const events = [];
  const coord = { board: null, x: null, y: null };
  let numShots = 0;
  const boardClickHandler = function(evt) {
    const $target = $(evt.target);
    const row = Number($target.attr(`data-row`));
    const col = Number($target.attr(`data-col`));
    if (Number.isNaN(row) || Number.isNaN(col)) return;
    $(this).find(`.tuple.selected`).removeClass(`selected`);
    $target.addClass(`selected`);
    coord.x = col;
    coord.y = row;
    coord.board = $(this).attr("data-board");
  };
  events.push({ $target: $game.find(`[data-board][data-board!="${id}"]`), type: "click", handler: boardClickHandler});

  const boardHoverHandler = function(evt) {
    const $target = $(evt.target);
    const row = Number($target.attr(`data-row`));
    const col = Number($target.attr(`data-col`));
    if (Number.isNaN(row) || Number.isNaN(col)) return;
    $(this).find(`.tuple.hover`).removeClass(`hover`);
    $target.addClass(`hover`);
  };
  events.push({ $target: $game.find(`[data-board][data-board!="${id}"]`), type: "mouseover", handler: boardHoverHandler});
  
  const boardOutHandler = function() {
    $(this).find(`.hover`).removeClass("hover");
  };
  events.push({ $target: $game.find(`[data-board][data-board!="${id}"]`), type: "mouseout", handler: boardOutHandler});

  const fireHandler = function() {
    if (coord.x === null || coord.y === null || shots[`${coord.x}-${coord.y}`] !== undefined) return;
    shots[`${coord.x}-${coord.y}`] = false;
    numShots += 1;
    const $tuple = $game.find(`[data-board][data-board!="${id}"] .selected`).removeClass("selected");
    $tuple.append($(`<div class="missile ${shots[`${coord.x}-${coord.y}`] ? "hit" : "miss"}"></div>`));
    if (numShots >= shots.max) {
      $game.find(`[data-board][data-board!="${id}"] .hover`).removeClass("hover");
      transition("NEXT_TURN");
    }
  };
  events.push({ $target: $game.find(`[data-button-id="fire"]`), type: "click", handler: fireHandler});


  return events;
}

const startCombat = function({ $game, rows, cols }, player, transition) {
  if (player.type === "AI") {
    return [];
  } 
  $game.find(`.buttons`).replaceWith(createButton("fire"));
  return getCombatHandlers({ $game, rows, cols }, player, transition);
};

const getSetUpHandlers = function({ $game, rows, cols }, {id, ships}, transition) {
  const events = [];
  let curShip = null;
  let isVert = true;

  const rotateHandler = function() {
    isVert = !isVert;
  }
  events.push({ $target: $game.find(`[data-button-id="rotate"]`), type: "click", handler: rotateHandler});

  const shipClickHandler = function(evt) {
    const $target = $(this);
    const shipId = $target.attr(`data-ship-id`);
    if (shipId === undefined) return;
    if (curShip === shipId) {
      isVert = !isVert;
    }
    curShip = shipId;
    $target.parent().children().removeClass("selected");
    $target.addClass("selected");
  };
  events.push({ $target: $game.find(`[data-ship-id].ship`), type: "click", handler: shipClickHandler});

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
    const shipStart = getAdjustedPos(isVert, ship.length, {row, col}, {rows, cols});
    const shipTiles = [];
    for(let i = shipStart; i < shipStart + ship.length; i++) {
      const $tile = $board
        .find(`[data-${isVert ? "row" : "col"}=${i}][data-${!isVert ? `row=${row}` : `col=${col}`}]`);
      const shipId = $tile.attr('data-ship-id');
      if (shipId !== undefined && shipId !== curShip) return;
      shipTiles.push($tile);
    }
    $board.find(`[data-ship-id="${curShip}"].tuple`).removeAttr("data-ship-id");
    for(const $tile of shipTiles) {
      $tile.attr("data-ship-id",curShip);
    }
    const start = { x: shipTiles[0].attr("data-col"), y: shipTiles[0].attr("data-row") };
    const end = { x: shipTiles[shipTiles.length - 1].attr("data-col"), y: shipTiles[shipTiles.length - 1].attr("data-row") };
    ships[curShip] = {...ship, start, end};
  };
  events.push({ $target: $game.find(`[data-board][data-board="${id}"]`), type: "click", handler: boardClickHandler});

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
  events.push({ $target: $game.find(`[data-board][data-board="${id}"]`), type: "mouseover", handler: boardHoverHandler});
  
  const boardOutHandler = function() {
    $(this).find(`.hover`).removeClass("hover");
  };
  events.push({ $target: $game.find(`[data-board][data-board="${id}"]`), type: "mouseout", handler: boardOutHandler});

  const boardSubmitHandler = function() {
    if (!areValid(ships)) return $(this).parent().parent().append(createError("All ships must be added before starting"));
    transition("NEXT_SETUP");
  };
  events.push({ $target: $game.find(`[data-button-id="save"]`), type: "click", handler: boardSubmitHandler});

  return events;
}

const setUpGame = function(game, player, transition) {
  if (player.type === "AI") {
    return [];
  } else if (player.type === "LOCAL") {
    return getSetUpHandlers(game, player, transition);
  }
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

const shiftSpotlight = function($game, player) {
  $game.find(`[data-board][data-board!="${player}"]`).parent().removeClass(`spotlight`);
  $game.find(`[data-board][data-board="${player}"]`).parent().addClass(`spotlight`);
}

const setPhaseOpts = function(game, players, setGameData) {
  return {
    START: function(evts, player, transition) {
      removeEventHandlers(evts);
      const newEvts = startCombat(game, players[player], transition);
      setGameData(newEvts, null);
      setEventHandlers(newEvts);
    },
    SETUP: function(evts, player, transition) {
      removeEventHandlers(evts);
      const newEvts = getSetUpHandlers(game, players[player], transition);
      setGameData(newEvts, null);
      setEventHandlers(newEvts);
    },
    NEXT_TURN: function(evts, player, transition) {
      setGameData(evts, (player + 1) % players.length);
      setTimeout(function() {
        shiftSpotlight(game.$game, player);
        transition("START");
      }, 500);
    },
    NEXT_SETUP: function(evts, player, transition) {
      const nextPlayer = (player + 1) % players.length;
      shiftSpotlight(game.$game, nextPlayer);
      if (nextPlayer === 0) return transition("START");
      setGameData(evts, nextPlayer);
      transition("SETUP");
    },
    VICTORY: function() {

    },
    DEFEAT: function() {

    },
  };
}

const setupPhase = function(game, players) {
  const gameData = {
    evts: [],
    player: 0,
  }
  const setGameData = function(evts, player) {
    gameData.evts = evts || gameData.evts;
    gameData.player = player === null ? gameData.player : player;
  }
  const OPTS = setPhaseOpts(game, players, setGameData);
  const transition = function(phase) {
    OPTS[phase](gameData.evts, gameData.player, transition);
  };
  transition("SETUP");
};

const createGame = function({rows, cols}, maxShots = 1) {
  const { $ships, shipsArr } = setupShips();
  const $game = createGameElement(rows, cols, 2);
  $game.find(`div.stats`).prepend($ships);
  $game.find(`div.buttons`).prepend(createButton("save"));
  const players = [ createPlayer(0, shipsArr[0], maxShots, "LOCAL"), createPlayer(1, shipsArr[1], maxShots, "LOCAL") ];
  shiftSpotlight($game, 0);

  setupPhase({ $game, rows, cols }, players);

  return $game;
};
