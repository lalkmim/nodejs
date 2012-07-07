var socket = null;
var salas = new Array();

$(document).ready(function() {
  $('#div_conectar').css('display', 'block');
  $('#div_entrar').css('display', 'none');
  $('#div_texto').css('display', 'none');
  
  $('#chat').tabs({closable: true});
  
  $('#but_conectar').live('click', function() {
    // Estabelecer conexão
    $('#but_conectar').attr('disabled', 'disabled');
    $('#but_conectar').attr('value', 'Conectando...');
    
    socket = io.connect(window.location.href);
    
    socket.emit('login', { 
      autor: $('#nome').val()
    });
    
    // Eventos dos botões
    $('#but_ok').live('click', function() {
	  socket.emit('chat', {
        sala: $('#sala').val(),
        msg: $('#texto').val(),
        autor: $('#nome').val()
	  });
    });
    
    $('#texto').keypress(function(e) {
      if(e.which == 13 || e.keyCode == 13) {
        $('#but_ok').click();
      }
    });
    
    $('#but_entrar').live('click', function() {
	  var nome_sala = $('#sala').val();
	  var nome_autor = $('#nome').val();
	  
	  console.log('nome_sala: ' + nome_sala);
	  console.log('nome_autor: ' + nome_autor);
	  
      socket.emit('entrar_sala', {
		sala: nome_sala,
        autor: nome_autor
	  });
    });
    
    $('#sala').keypress(function(e) {
      if(e.which == 13 || e.keyCode == 13) {
        $('#but_entrar').click();
      }
    });
    
    // Eventos do servidor
    socket.on('logged_in', function(dados) {
      $('#div_conectar').css('display', 'none');
      $('#div_entrar').css('display', 'block');
      $('#div_texto').css('display', 'none');
	  
	  console.log(dados);
      var span = '<span class="linhaChat">[' + dados.dataHora + '] ' + dados.autor + ' > ' + dados.msg + '</span>';
      $('#status').append(span);
    });
	
	socket.on('entrou_sala', function(dados) {
      $('#div_conectar').css('display', 'none');
      $('#div_entrar').css('display', 'none');
      $('#div_texto').css('display', 'block');
	  
	  console.log(dados);
      var span = '<span class="linhaChat">[' + dados.dataHora + '] ' + dados.autor + ' > ' + dados.msg + '</span>';
      $('#status').append(span);
	  
	  $('#chat').tabs('add', '#' + $('#sala').val(), $('#sala').val());
    });
    
    // Deprecated - os usuários devem ser atualizados ao selecionar uma sala
    socket.on('atualizar_usuarios', function(dados) {
      $('#div_usuarios').html('');
      for(var i in dados.usuarios) {
        var user = dados.usuarios[i];
        
        var link = '<span';
        link += ' class="linhaUsuario"';
        link += ' onclick="$(\'#texto\').attr(\'value\', this.value + \': \'); $(\'#texto\').focus();">';
        link += user.nome;
        link += '</span>';
        
        $('#div_usuarios').append(link);
      }
    });
    
    socket.on('atualizar_salas', function(dados) {
	  console.log('atualizar_salas.dados');
	  console.log(dados);
	
      $('#div_salas').html('');
      for(var i in dados.salas) {
        var sala = dados.salas[i];
        
        var span = '<span';
        span += ' class="linhaSala"';
        span += ' onclick="$(\'#sala\').attr(\'value\', $(\'#div_salas.sala_selecionada\').text() + \': \');">';
        span += sala.nome;
        span += '</span>';
        
        $('#div_salas').append(span);
      }
    });
    
    socket.on('chat', function (dados) {
      $('#div_conectar').css('display', 'none');
      $('#div_entrar').css('display', 'none');
      $('#div_texto').css('display', 'block');
        
	  console.log('chat.dados');
      console.log(dados);
	  
      var estilo = 'linhaChat';
      if(dados.msg.indexOf($('#nome').val()) >= 0)
        estilo = 'linhaChatCitado';
        
      var span = '<span class="' + estilo + '">[' + dados.dataHora + '] ' + dados.autor + ' > ' + dados.msg + '</span>';
      
      $('#' + dados.sala.nome).append(span);
    });
  });
});