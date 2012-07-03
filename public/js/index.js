var socket = null;
var salas = new Array();

$(document).ready(function() {
  $('#div_texto').css('display', 'none');
  $('#div_conectar').css('display', 'block');
  
  $('#but_ok').live('click', function() {
    socket.emit('chat', {
      sala: $('#div_salas.sala_selecionada').text(),
      msg: $('#texto').val(),
      autor: $('#nome').val() });
  });
  
  $('#but_conectar').live('click', function() {
    $('#but_conectar').attr('disabled', 'disabled');
    $('#but_conectar').attr('value', 'Conectando...');
    
    socket = io.connect(window.location.href);
    
    socket.emit('login', { 
      autor: $('#nome').val()
    });
    
    socket.on('usuarios', function(dados) {
      $('#div_usuarios').html('');
      for(var i in dados.usuarios) {
        var user = dados.usuarios[i];
        $('#div_usuarios').append('<a href="#" onclick="$(\'#texto\').attr(\'value\', this.value + \': \'); $(\'#texto\').focus();">' + user.nome + '</a><br/>');
      }
    });
    
    socket.on('salas', function(dados) {
    });
    
    socket.on('chat', function (dados) {
      $('#div_conectar').css('display', 'none');
      $('#div_texto').css('display', 'block');
        
      console.log(dados);
      var estilo = 'linhaChat';
      if(dados.msg.indexOf($('#nome').val()) >= 0)
        estilo = 'linhaChatCitado';
        
      $('#chat').append('<span class="' + estilo + '">[' + dados.dataHora + '] ' + dados.autor + '>> ' + dados.msg + '</span>');
    });
  });
  
  $('#texto').keypress(function(e) {
    if(e.which == 13 || e.keyCode == 13) {
      $('#but_ok').click();
    }
  });
});