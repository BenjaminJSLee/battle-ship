const express = require('express');
const cookieSession = require('cookie-session');
const sass = require("node-sass-middleware");
const app = express();

const PORT = 3000;

app.set('view engine','ejs');

app.use(cookieSession({
  session: 'session',
  keys: ["one","two"],
}));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));

app.use(express.static('public'));

const gamesRoutes = require('./routes/games.js');

app.use('/games', gamesRoutes());

app.get('/', (req, res) => {
  res.render('ship_index',req.tempVars);
});

app.get('/:id', (req, res) => {
  res.render('ship_game');
});

app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
});