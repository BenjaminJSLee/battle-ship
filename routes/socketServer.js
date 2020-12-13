const { start } = require("repl");

const startSocketServer = (app, gameData) => {
  const server = require("http").Server(app);
  
  const WebSocket = require("ws");
  const wss = new WebSocket.Server({ server });

}
module.exports = startSocketServer;