
const createShip = function(id, length) {
  return {
    id,
    start: {x: null, y: null},
    end: {x: null, y: null},
    hits: [],
    length,
    isVert: true,
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

const createShipElement = function(ship) {
  const $ship = $(`<div data-ship-id="${ship.id}" class="ship"></div>`);
  for (let i = 0; i < ship.length; i++) {
    $ship.append(`<div class="block${i === 0 ? " start" : ""}${i === ship.length - 1 ? " end" : ""}"></div>`);
  }
  return $ship;
}

const createShipsElement = function(shipLens) {
  const ships = {};
  const $ships = $(`<div class="ships"></div>`);
  for (let i = 0; i < shipLens.length; i++) {
    const ship = createShip(i + 1, shipLens[i]);
    const $ship = createShipElement(ship);
    ships[ship.id] = ship;
    $ships.append($ship);
  }
  return { $ships, ships };
}

const setupShips = function(shipLens = [1, 2, 3, 3, 4, 5]) {
  const { $ships , ships } = createShipsElement(shipLens);
  return { $ships , ships };
};
