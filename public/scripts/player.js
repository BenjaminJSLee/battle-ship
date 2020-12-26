const createPlayer = function(id, ships, maxShots, type, name = null) {
  return {
    id,
    type,
    name: name || `Player ${id + 1}`,
    ships,
    shots: { max: maxShots, total: 0 }
  };
};