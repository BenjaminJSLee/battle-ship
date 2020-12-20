
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
  return false;
};