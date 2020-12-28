
const toggleShipsView = function($game, player = null, shipId = null) {
  const $board = $game.find(`[data-board${ player ? `=${player.id}` : "" }]`);
  const $ships = $board.find(`[data-ship-id${shipId !== null ? `=${shipId}` : "" }]`);
  if ($ships.length !== 0) {
    $ships.removeClass("start").removeClass("end");
    $ships.removeAttr("data-ship-id").removeAttr("data-vertical");
    if (shipId === null) return false;
  }
  if (!player) {
    return false;
  }
  const ships = shipId ? { [shipId]: player.ships[shipId] } : player.ships;
  for (const id in ships) {
    const { start, end } = ships[id];
    const isVert = start.x === end.x;
    const startInd =  Number(isVert ? start.y : start.x);
    const endInd = Number(isVert ? end.y : end.x);
    if (Number.isNaN(startInd) || Number.isNaN(endInd)) return;
    for (let i = startInd; i <= endInd; i++) {
      const $tuple = $board.find(`[data-${isVert ? "row" : "col"}=${i}][data-${!isVert ? `row=${start.y}` : `col=${start.x}`}]`);
      $tuple.attr("data-ship-id",`${id}`);
      if (isVert) $tuple.attr("data-vertical", "");
      if (i === startInd) $tuple.addClass("start");
      if (i === endInd) $tuple.addClass("end");
    }
  }
  return true;
}

const areAllSunk = function(board, players) {
  const { ships } = players[board];
  for (const id in ships) {
    if (!ships[id].isSunk()) return false;
  }
  return true;
}

const checkShot = function({ x, y }, ships) {
  for (const id in ships) {
    let ship = ships[id];
    if (ship.isHit({x, y})) {
      return ship.isSunk() ? `${ship.name} HIT and SUNK!` : "HIT";
    }
  }
  return "MISS";
};

const getCombatHandlers = function({ $game, rows, cols }, player, players, transition) {
  const {shots, ships} = players[player];
  const events = [];
  const coord = { board: null, x: null, y: null };
  let numShots = 0;

  const toggleShipClickHandler = function() {
    toggleShipsView($game, players[player]);
  }
  events.push({ $target: $game.find(`[data-button-id="toggle-visible"]`), type: "click", handler: toggleShipClickHandler});

  const boardClickHandler = function(evt) {
    const $target = $(evt.target);
    const row = Number($target.attr(`data-row`));
    const col = Number($target.attr(`data-col`));
    if (Number.isNaN(row) || Number.isNaN(col) || shots[`${col}-${row}`] !== undefined) return;
    $(this).find(`.tuple.selected`).removeClass(`selected`);
    $target.addClass(`selected`);
    coord.x = col;
    coord.y = row;
    coord.board = $(this).attr("data-board");
  };
  events.push({ $target: $game.find(`[data-board][data-board!="${player}"]`), type: "click", handler: boardClickHandler});

  const boardHoverHandler = function(evt) {
    const $target = $(evt.target);
    const row = Number($target.attr(`data-row`));
    const col = Number($target.attr(`data-col`));
    if (Number.isNaN(row) || Number.isNaN(col)) return;
    $(this).find(`.tuple.hover`).removeClass(`hover`);
    $target.addClass(`hover`);
  };
  events.push({ $target: $game.find(`[data-board][data-board!="${player}"]`), type: "mouseover", handler: boardHoverHandler});
  
  const boardOutHandler = function() {
    $(this).find(`.hover`).removeClass("hover");
  };
  events.push({ $target: $game.find(`[data-board][data-board!="${player}"]`), type: "mouseout", handler: boardOutHandler});

  const fireHandler = function() {
    if (coord.x === null || coord.y === null || coord.board === null || shots[`${coord.x}-${coord.y}`] !== undefined) return;
    const shotType = checkShot(coord, players[coord.board].ships);
    if (shotType !== "MISS" && areAllSunk(coord.board, players)) return transition("VICTORY");
    shots[`${coord.x}-${coord.y}`] = { board: coord.board, shotNumber: shots.total, shotType };
    const msg = `${players[player].name} shoots at ${String.fromCharCode('A'.charCodeAt(0) + coord.x)}${coord.y + 1}: ${shotType}`;
    addLogMsg($game.find(`[data-id="log"]`), msg);
    shots.total += 1;
    numShots += 1;
    const $tuple = $game.find(`[data-board][data-board!="${player}"] .selected`).removeClass("selected");
    $tuple.append($(`<div class="missile ${shotType !== "MISS" ? "hit" : "miss"}"></div>`));
    if (numShots >= shots.max) {
      $game.find(`[data-board][data-board!="${player}"] .hover`).removeClass("hover");
      transition("NEXT_TURN");
      return;
    }
  };
  events.push({ $target: $game.find(`[data-button-id="fire"]`), type: "click", handler: fireHandler});


  return events;
}

const startCombat = function(game, player, players, transition) {
  if (players[player].type === "AI") {
    return [];
  } else if (players[player].type === "LOCAL") {
    toggleShipsView(game.$game);
    return getCombatHandlers(game, player, players, transition);
  }
};

const getSetUpHandlers = function({ $game, rows, cols }, player, transition) {
  const {id, ships} = player;
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
      $game.find(`[data-ship-id="${curShip}"].tuple`).removeAttr("data-ship-id");
      $target.removeClass("placed");
      ships[curShip] = {...ships[curShip], start: {x: null, y: null}, end: {x: null, y: null}};
      return;
    }
    curShip = shipId;
    $target.parent().children().removeClass("selected");
    $target.addClass("selected");
  };
  events.push({ $target: $game.find(`[data-ship-id].ship`), type: "click", handler: shipClickHandler});

  const boardClickHandler = function(evt) {
    if (!ships[curShip]) return;
    let ship = ships[curShip];
    if ((isVert && ship.length > rows) || (!isVert && ship.length > cols)) return;
    const $target = $(evt.target);
    const row = Number($target.attr(`data-row`));
    const col = Number($target.attr(`data-col`));
    if (Number.isNaN(row) || Number.isNaN(col)) return;
    const $board = $(this);
    const shipStart = getAdjustedPos(isVert, ship.length, {row, col}, {rows, cols});
    for(let i = shipStart; i < shipStart + ship.length; i++) {
      const $tile = $board
        .find(`[data-${isVert ? "row" : "col"}=${i}][data-${!isVert ? `row=${row}` : `col=${col}`}]`);
      const shipId = $tile.attr('data-ship-id');
      if (shipId !== undefined && shipId !== curShip) return;
    }
    const start = { x: isVert ? col : shipStart, y: isVert ? shipStart : row };
    const end = { x: isVert ? col : shipStart + ship.length - 1, y: isVert ? shipStart + ship.length - 1 : row };
    ships[curShip] = {...ship, start, end};
    toggleShipsView($game, player, curShip);
    $game.find(`.stats [data-ship-id=${curShip}]`).addClass(`placed`);
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
    if (!areValid(ships)) return $game.find(`[data-id="log"]`).append(createError("All ships must be added before starting"));
    transition("NEXT_SETUP");
  };
  events.push({ $target: $game.find(`[data-button-id="save"]`), type: "click", handler: boardSubmitHandler});

  return events;
}

const setUpGame = function(game, player, transition) {
  if (player.type === "AI") {
    return [];
  } else if (player.type === "LOCAL") {
    toggleShipsView(game.$game);
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
      const newEvts = startCombat(game, player, players, transition);
      setGameData(newEvts, null);
      setEventHandlers(newEvts);
    },
    SETUP: function(evts, player, transition) {
      removeEventHandlers(evts);
      const newEvts = setUpGame(game, players[player], transition);
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
      if (nextPlayer === 0) {
        game.$game.find(`.buttons`).empty().append(
          createButton("fire"),
          createButton("toggle-visible", "Show/hide ships")
        );
        return transition("START");
      }
      setGameData(evts, nextPlayer);
      transition("SETUP");
    },
    VICTORY: function(evts, player) {
      removeEventHandlers(evts);
      for (const player of players) {
        if (!toggleShipsView(game.$game, player)) toggleShipsView(game.$game, player);
      }
      alert(`${players[player].name} wins!`);
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
  const { $ships, shipsArr } = setupShips([2,2]);
  const $game = createGameElement(rows, cols, 2);
  $game.find(`div.stats`).prepend($ships);
  const players = [ createPlayer(0, shipsArr[0], maxShots, "LOCAL"), createPlayer(1, shipsArr[1], maxShots, "LOCAL") ];
  shiftSpotlight($game, 0);

  setupPhase({ $game, rows, cols }, players);

  return $game;
};
