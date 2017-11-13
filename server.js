const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use('/systran/js', express.static(__dirname+'/client/js'));
app.use('/systran/css', express.static(__dirname+'/client/css'));

app.get('/systran', function(req, res) {
  res.sendFile(__dirname+"/client/index.html");
});

app.listen(8000);
console.log("Click on : http://localhost:8000/systran/");