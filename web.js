var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

var usuarios = new Array();
var salas = new Array();

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/images', express.static(__dirname + '/public/img'));

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
    
    io.sockets.emit('atualizar_salas', {
      salas: salas
    });
    /*    
    socket.emit('chat', {
      msg: 'Conectado! Bem-vindo ' + dados.autor + '.',
      dataHora: formatHour(dataHora),
      autor: 'SERVIDOR'
    });
    */
  });
  
  socket.on('entrar_sala', function(dados) {
	console.log(dados);
    var sala = null;
    if(!dados.id) {
      sala = {
        id: salas.length,
        nome: dados.sala,
        participantes: new Array()
      };
      
      salas[sala.id] = sala;
    } else {
      sala = salas[dados.id];
    }
    
    var usuario = usuarios[socket.transport.sessionid];
    sala.participantes[usuario.id] = usuario;
                 
    socket.join(sala.id);
    socket.broadcast.to(sala.id).emit('chat', {
      msg: dados.autor + ' entrou.',
      dataHora: formatHour(dataHora),
      autor: 'SERVIDOR',
      sala: sala
    });
  });
  
  socket.on('chat', function (dados) {
    console.log(dados);
    
    var dataHora = new Date();
    dataHora.setHours(dataHora.getHours() - 3);    
    
    io.sockets.emit('chat', {
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