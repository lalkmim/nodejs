var express = require('express');

var i = 0;

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Teste teste');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});