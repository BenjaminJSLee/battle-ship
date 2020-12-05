const express = require('express');
const app = express();

const PORT = 3000;

app.set('view engine','ejs');

app.get('/', (req, res) => {
  res.render('ship_index',req.tempVars);
});

app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
});