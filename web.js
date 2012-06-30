var app = require('express').createServer();

var io = require('socket.io').listen(app);

app.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('chat', { msg: 'Conectado!',
                        hora: new Date(),
                        autor: 'SERVIDOR' });

  socket.on('chat', function (data) {
    console.log(data);
    socket.emit('chat', { msg: data.msg,
                          hora: new Date(),
                          autor: data.autor });
  });
});