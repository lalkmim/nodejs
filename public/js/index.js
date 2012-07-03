var socket = null;

$(document).ready(function() {
  $('#div_texto').css('display', 'none');
  $('#div_conectar').css('display', 'block');
  
  $('#but_ok').live('click', function() {
    socket.emit('chat', {
      acao: 'mensagem',
      msg: $('#texto').val(),
      dataHora: formatHour(new Date()),
      autor: $('#nome').val() });
  });
  
  $('#but_conectar').live('click', function() {
    $('#but_conectar').attr('disabled', 'disabled');
    $('#but_conectar').attr('value', 'Conectando...');
    
    socket = io.connect(window.location.href);
    
    socket.emit('chat', {
      acao: 'login',
      msg: $('#texto').val(),
      dataHora: formatHour(new Date()),
      autor: $('#nome').val() });
    
    socket.on('chat', function (dados) {
      if(dados.acao == 'mensagem') {
        $('#div_conectar').css('display', 'none');
        $('#div_texto').css('display', 'block');
        
        console.log(dados);
        $('#chat').append('<br/>[');
        $('#chat').append(dados.dataHora);
        $('#chat').append('] ');
        $('#chat').append(dados.autor);
        $('#chat').append(': ');
        $('#chat').append(dados.msg);
      } else if(dados.acao == 'usuarios') {
        $('#div_usuarios').html('');
        for(var i in dados.usuarios) {
          var user = dados.usuarios[i];
          $('#div_usuarios').append('<a href="#" onclick="$(\'#texto\').attr(\'value\', \'' + user.nome + ': \');">')
          $('#div_usuarios').append(user.nome);
          $('#div_usuarios').append('</a><br/>');
        }
      }
    });
  });
  
  $('#texto').keypress(function(e) {
    if(e.which == 13 || e.keyCode == 13) {
      $('#but_ok').click();
    }
  });
});