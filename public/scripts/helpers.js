
/** creates an error message element. Does not check for XXS as
 * this function is a helper function for devs and will only ever display on
 * a local client's page.
 *
 * @param {String} msg used as the error message
 */
const createError = function(msg, clear = true) {
  if (clear) $(`.err`).remove();
  const $err = $(`
    <div class="err">
      <span><i class="fas fa-exclamation-circle"></i></span>
      <span>${msg}</span>
    </div>
  `);
  $err.on('click', () => {
    $err.slideUp(500,function() {
      $err.remove();
    });
  });
  return $err;
};

const adjustForBounds = function(point, max, len) {
  if (point < 0) {
    return 0;
  } else if (point + len >= max) {
    return point - (point + len - max);
  }
  return point;
};

const getAdjustedPos = function(isVert, len, {row, col}, {rows, cols}) {
  const center = Math.floor(len/2);
  if (isVert) {
    return adjustForBounds(row - center, rows, len)
  } else { 
    return adjustForBounds(col - center, cols, len)
  }
};

const areValid = function(ships) {
  for (const id in ships) {
    const { start, end } = ships[id];
    if (start.x === null || start.y === null || end.x === null || end.y === null) return false;
  }
  return true;
};

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