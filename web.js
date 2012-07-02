var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/img'));

app.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log('socket: ' + socket);
  
  var dataHora = new Date();
  dataHora.setHours(dataHora.getHours() - 3);
  socket.emit('chat', { msg: 'Conectado!',
                        dataHora: formatHour(dataHora),
                        autor: 'SERVIDOR' });

  socket.on('chat', function (data) {
    console.log(data);
    io.sockets.emit('chat', { msg: data.msg,
                          dataHora: data.dataHora,
                          autor: data.autor });
  });
});

function formatHour(dataHora) {
  var that = new Date(dataHora);
  var temp = '';
  
  if(that.getHours() < 10)
    temp += '0';
  
  temp += that.getHours() + ':';
  
  if(that.getMinutes() < 10)
    temp += '0';
  
  temp += that.getMinutes();
  
  return temp;
}