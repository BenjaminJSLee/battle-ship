const express = require('express');
const router  = express.Router();

const gamesRouter = (gameData) => {
  router.get("/:game_id", (req, res) => {
    gameData[req.params.game_id];
  });
  return router;
};

module.exports = gamesRouter;