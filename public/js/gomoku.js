$(document).ready(function() {
  $('#select_salas').attr('disabled', 'disabled');
  desenharTabuleiro($('#mesa')[0], 25, 25);
  
  $('#mensagem').append('<span>&gt;&gt;&gt; Conectando e carregando informações...</span><br/>');
  
  now.ready(function() {
    $('#select_salas').live('change', function(dados) {
      if(this.selectedIndex == 1) {
        this.disabled = true;
        now.criarSala();
        now.simbolo = 'O';
        now.vez = 0;
        now.player = 1;
      } else if(this.selectedIndex > 1) {
        this.disabled = true;
        now.entrarSala(this.options[this.selectedIndex].value);
        now.simbolo = 'X';
        now.vez = 0;
        now.player = 0;
      }
    });
    
    now.msg = function(texto) {
      $('#mensagem').append('<span>&gt;&gt;&gt; ' + texto + '</span><br/>');
    }
      
    now.atualizarComboSalas = function() {
      console.log('>>> now.atualizarComboSalas');
      var opts = $('#select_salas option').length;
      
      while($('#select_salas option').length > 2) {
        $('#select_salas').find('option:last').remove();
      }
      
      if(typeof now.listaSalasDisponiveis != 'undefined') {
        for(var i=0; i<now.listaSalasDisponiveis.length; i++) {
          var sala = now.listaSalasDisponiveis[i];
          $('#select_salas').append(new Option(sala, sala, true, false));
        }
      }
    }
      
    now.informarVez = function() {
      if(now.vez = now.player) {
        now.msg('Sua vez!');
      }
    }
    
    now.atualizarComboSalas();
    
    $('#select_salas').removeAttr('disabled');
    now.msg('Conectado! Selecione a sala desejada.');
  });
});
  
function desenharTabuleiro(div, linhas, colunas) {
  var table = $(document.createElement('table')).attr('id', 'tabuleiro')[0];
  
  div.appendChild(table);
  
  for(var i=0; i<linhas; i++) {
    var linha = table.insertRow();
    for(var j=0; j<colunas; j++) {
      var celula = linha.insertCell();
      celula.id = 'cell_' + i + '_' + j;
      celula.onclick = cellClickHelper(i, j);
    }
  }
}
  
function cellClickHelper(i, j) {
  return function() {
    console.log(i + ' - ' + j + ': ' + now.simbolo);
    if(now.vez == now.player) {
      var busca_id = '#cell_' + i + '_' + j;
      $(busca_id).text(now.simbolo);
      $(busca_id).unbind('click');
      now.atualizarVez(now.sala, 1 - now.vez);
    } else {
      alert('Por favor, aguarde sua vez.');
    }
  }
}