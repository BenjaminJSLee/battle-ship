const createPlayer = function(id, ships, maxShots, type, name = "default pirate") {
  return {
    id,
    type,
    name,
    ships,
    shots: { max: maxShots }
  };
};