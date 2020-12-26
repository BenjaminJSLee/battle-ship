
const createShip = function(id, name, length) {
  return {
    id,
    name: name || `Ship_${id}`,
    start: {x: null, y: null},
    end: {x: null, y: null},
    hits: [],
    length,
    isHit(coord) {
      const {x , y} = coord;
      if (x === undefined || y === undefined) return false;
      const { sX, sY } = { sX: this.start.x, sY: this.start.y };
      const { eX, eY } = { eX: this.end.x, eY: this.end.y };
      let spot = -1;
      if (sX === eX && x === sX) {
        spot = y - Math.min(eY,sY);
      } else if (sY === eY && sY === y) {
        spot = x - Math.min(eX,sX);
      }
      if ( spot >= 0 && spot < this.length ) {
        if (!this.hits.includes(spot)) this.hits.push(spot);
        return true;
      }
      return false;
    },
    isSunk() {
      return this.hits.length >= this.length;
    }
  };
};

const createShips = function(shipLens) {
  const ships = {};
  const shipNames = {
    "Destroyer": 2, 
    "Cruiser": 3, 
    "Submarine": 3, 
    "Battleship": 4, 
    "Carrier": 5, 
  };
  for (let i = 0; i < shipLens.length; i++) {
    const ship = createShip(i + 1, null, shipLens[i]);
    ships[ship.id] = ship;
  }
  return ships;
};

const createShipElement = function(id, len) {
  const $ship = $(`<div data-ship-id="${id}" class="ship"></div>`);
  for (let i = 0; i < len; i++) {
    $ship.append(`<div class="block${i === 0 ? " start" : ""}${i === len - 1 ? " end" : ""}"></div>`);
  }
  return $ship;
}

const createShipsElement = function(shipLens) {
  const $ships = $(`<div class="ships"></div>`);
  for (let i = 0; i < shipLens.length; i++) {
    const $ship = createShipElement(i + 1, shipLens[i]);
    $ships.append($ship);
  }
  return $ships;
}

const setupShips = function(shipLens = [ 2, 3, 3, 4, 5 ]) {
  const $ships = createShipsElement(shipLens);
  const shipsArr = [ createShips(shipLens), createShips(shipLens) ];
  return { $ships , shipsArr };
};
