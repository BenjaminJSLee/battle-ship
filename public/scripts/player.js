const createPlayer = function(id, ships, maxShots, name = "default pirate") {
  return {
    id,
    name,
    ships,
    shots: { max: maxShots }
  };
};