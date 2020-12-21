
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