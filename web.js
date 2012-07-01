var app = require('express').createServer();

var io = require('socket.io').listen(app);

app.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('chat', { msg: 'Conectado!',
                        dataHora: new Date(),
                        autor: 'SERVIDOR' });

  socket.on('chat', function (data) {
    console.log(data);
    socket.emit('chat', { msg: data.msg,
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