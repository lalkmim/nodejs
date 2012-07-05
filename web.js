var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

var usuarios = new Array();
var salas = new Array();

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/img'));

app.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log('socket.transport: ' + socket.transport);
  console.log('socket.transport.sessionid: ' + socket.transport.sessionid);
  
  socket.on('login', function(dados) {
    console.log(dados);
    
    var dataHora = new Date();
    dataHora.setHours(dataHora.getHours() - 3);
    
    usuarios.push({
      id: socket.transport.sessionid,
      nome: dados.autor,
      socket: socket
    });
    
    socket.emit('logged_in', {
      msg: 'Conectado! Bem-vindo ' + dados.autor + '.',
      dataHora: formatHour(dataHora),
      autor: 'SERVIDOR'
    });
    
    io.sockets.emit('salas', {
      salas: salas
    });
    
    socket.emit('chat', {
      msg: 'Conectado! Bem-vindo ' + dados.autor + '.',
      dataHora: formatHour(dataHora),
      autor: 'SERVIDOR'
    });
  });
  
  socket.on('entrar_sala', function(dados) {
    socket.join(dados.sala)
    socket.broadcast.to(dados.sala).emit('chat', {
      msg: dados.autor + ' entrou.',
      dataHora: formatHour(dataHora),
      autor: 'SERVIDOR'
    });
  });
  
  socket.on('chat', function (dados) {
    console.log(dados);
    
    var dataHora = new Date();
    dataHora.setHours(dataHora.getHours() - 3);    
    
    io.sockets.emit('chat', {
      acao: 'mensagem',
      msg: dados.msg,
      dataHora: formatHour(dataHora),
      autor: dados.autor,
      sala: sala
    });
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