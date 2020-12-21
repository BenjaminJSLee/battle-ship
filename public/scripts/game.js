
const getCombatHandlers = function({ $game, rows, cols }, {shots, ships}, transition) {
  const events = [];
  const coord = { x: null, y: null };
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
  };
  events.push({ $target: $game.find(`[data-board="attack"]`), type: "click", handler: boardClickHandler});

  const boardHoverHandler = function(evt) {
    const $target = $(evt.target);
    const row = Number($target.attr(`data-row`));
    const col = Number($target.attr(`data-col`));
    if (Number.isNaN(row) || Number.isNaN(col)) return;
    $(this).find(`.tuple.hover`).removeClass(`hover`);
    $target.addClass(`hover`);
  };
  events.push({ $target: $game.find(`[data-board="attack"]`), type: "mouseover", handler: boardHoverHandler});
  
  const fireHandler = function() {
    if (coord.x === null || coord.y === null || shots[`${coord.x}-${coord.y}`]) return;
    shots[`${coord.x}-${coord.y}`] = true;
    console.log(shots);
    numShots += 1;
    if (numShots >= shots.max) {
      $game.find(`[data-board="attack"] .selected, [data-board="attack"] .hover`).removeClass("selected").removeClass("hover");
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

const getSetUpHandlers = function({ $game, rows, cols }, {ships}, transition) {
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
  
  const boardOutHandler = function() {
    $(this).find(`.hover`).removeClass("hover");
  };
  events.push({ $target: $game.find(`[data-board="defend"]`), type: "mouseout", handler: boardOutHandler});

  const boardSubmitHandler = function() {
    if (!areValid(ships)) return $(this).parent().parent().append(createError("All ships must be added before starting"));
    transition("START");
  };
  events.push({ $target: $game.find(`[data-button-id="save"]`), type: "click", handler: boardSubmitHandler});

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

const shiftSpotlight = function($game, player) {
  $game.find(`[data-board="${player === 0 ? "defend" : "attack"}"]`).removeClass(`spotlight`);
  $game.find(`[data-board="${player === 0 ? "attack" : "defend"}"]`).addClass(`spotlight`);
}

const setPhaseOpts = function(game, players, setGameData) {
  return {
    SETUP: function (evts) {
      setEventHandlers(evts);
    },
    CLEANUP: function(evts) {
      removeEventHandlers(evts);
    },
    START: function(evts, player, transition) {
      removeEventHandlers(evts);
      setTimeout( function() {
        shiftSpotlight(game.$game, player);
      }, 500);
      setGameData(startCombat(game, players[player], transition), null);
      transition("SETUP");
    },
    RESTART: function(evts, player, transition) {
      removeEventHandlers(evts);
      setGameData(getSetUpHandlers(game, players[player], transition), null);
      transition("SETUP");
    },
    NEXT_TURN: function(evts, player, transition) {
      setGameData(evts, (player + 1) % players.length);
      transition("START");
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
    gameData.player = player || gameData.player;
  }
  const OPTS = setPhaseOpts(game, players, setGameData);
  const transition = function(phase) {
    OPTS[phase](gameData.evts, gameData.player, transition);
  };
  transition("RESTART");
};

const createGame = function({rows, cols}, maxShots = 1) {
  const { $ships, shipsArr } = setupShips([2]);
  const $game = createGameElement(rows, cols);
  $game.find(`div.stats`).prepend($ships);
  $game.find(`div.buttons`).prepend(createButton("save"));
  const players = [ createPlayer(0, shipsArr[0], maxShots, "PLAYER"), createPlayer(1, shipsArr[1], maxShots, "AI") ];
  shiftSpotlight($game, 1);

  setupPhase({ $game, rows, cols }, players);

  return $game;
};
