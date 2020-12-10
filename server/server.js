const express = require('express');
const sass = require("node-sass-middleware");
const app = express();

const PORT = 3000;

app.set('view engine','ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('ship_index',req.tempVars);
});

app.get('/:id', (req, res) => {
  res.render('ship_game');
});

app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
});