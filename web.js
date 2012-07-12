var nowjs = require('express');
var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

var usuarios = new Object();
var salas = new Object();

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/images', express.static(__dirname + '/public/img'));

app.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/gomoku', function (req, res) {
  res.sendfile(__dirname + '/public/gomoku.html');
});

io.sockets.on('connection', function (socket) {
  console.log('>>> socket.transport: ');
  console.log(socket.transport);
  console.log('>>> socket.transport.sessionid: ');
  console.log(socket.transport.sessionid);
  
  socket.on('login', function(dados) {
    console.log('>>> login.dados: ');
    console.log(dados);
    
    var dataHora = new Date();
    dataHora.setHours(dataHora.getHours() - 3);
    
    var usuario = {
      id: socket.transport.sessionid,
      nome: dados.autor,
      socket: socket
    };
    
    usuarios[usuario.id] = usuario;                  
    
    socket.emit('logged_in', {
      msg: 'Conectado! Bem-vindo ' + dados.autor + '.',
      dataHora: formatHour(dataHora),
      autor: 'SERVIDOR'
    });
  });
  
  socket.on('entrar_sala', function(dados) {
    var dataHora = new Date();
    dataHora.setHours(dataHora.getHours() - 3);
    
    console.log('>>> entrar_sala.dados: ');
    console.log(dados);
    
    console.log('>>> salas[dados.sala]');
    console.log(salas[dados.sala]);
    
    var sala = null;
    var nome_sala = dados.sala;
    if(typeof salas[dados.sala] == 'undefined') {
      console.log('>>> 1');
      sala = new Object();
      sala.nome = dados.sala;
      sala.participantes = new Array();
      
      salas[sala.nome] = sala;
    } else {
      console.log('>>> 2');
      sala = salas[nome_sala];
    }
    
    console.log('>>> entrar_sala.sala: ');
    console.log(sala);
    
    var usuario = usuarios[socket.transport.sessionid];
    
    console.log('>>> entrar_sala.usuario: ');
    console.log(usuario);
    
    sala.participantes[usuario.id] = usuario;
    
    socket.join(sala.nome);
    
    socket.emit('entrou_sala', {
      msg: 'Você entrou na sala #' + sala.nome + '.',
      dataHora: formatHour(dataHora),
      autor: 'SERVIDOR',
      sala: sala
    });
    
    socket.broadcast.to(sala.nome).emit('chat', {
      msg: dados.autor + ' entrou.',
      dataHora: formatHour(dataHora),
      autor: 'SERVIDOR',
      sala: sala
    });
    
    io.sockets.emit('atualizar_salas', {
      salas: salas,
      msg: 'Salas atualizadas.',
      dataHora: formatHour(dataHora),
      autor: 'SERVIDOR',
      sala: {
        nome: 'status',
        participantes: new Array()
      }
    });
  });
  
  socket.on('chat', function (dados) {
    console.log('>>> chat.dados: ');
    console.log(dados);
    
    var dataHora = new Date();
    dataHora.setHours(dataHora.getHours() - 3);
    
    io.sockets.emit('chat', {
      msg: dados.msg,
      dataHora: formatHour(dataHora),
      autor: dados.autor,
      sala: salas[dados.sala]
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