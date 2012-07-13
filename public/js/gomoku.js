$(document).ready(function() {
  $('#select_salas').attr('disabled', 'disabled');
  desenharTabuleiro($('#mesa')[0], 40, 30);
  
  $('#mensagem').append('Conectando e carregando informações...<br/>');
  
  now.ready(function() {
    $('#select_salas').live('change', function(dados) {
      if(this.selectedIndex == 1) {
        this.disabled = true;
        now.criarSala();
        now.simbolo = 'X';
        now.vez = 0;
        now.player = 0;
      } else if(this.selectedIndex > 1) {
        this.disabled = true;
        now.entrarSala(this.options[this.selectedIndex].value);
        now.simbolo = 'O';
        now.vez = 0;
        now.player = 1;
      }
    });
    
    now.msg = function(texto) {
      $('#mensagem').append(texto);
      $('#mensagem').append('<br/>');
    }
      
    now.atualizarComboSalas = function() {
      console.log('>>> now.atualizarComboSalas');
      var opts = $('#select_salas').find('option');
      
      while(opts.length > 2) {
        $('#select_salas').find('option:last').remove();
      }
      
      for(var i=0; i<now.listaSalasDisponiveis.length; i++) {
        var sala = now.listaSalasDisponiveis[i];
        opts[opts.length] = new Option(sala, sala, true, true);
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
      celula.onclick = cellClickHelper(i, j);
    }
  }
}
  
function cellClickHelper(i, j) {
  return function() {
    console.log(i + ' - ' + j + ': ' + now.simbolo);
    if(now.vez == now.player) {
      $('#tabuleiro')[0].rows[i].cells[j].innerText = now.simbolo;
      $(this).unbind('click');
      now.vez = 1 - now.vez;
    } else {
      alert('Por favor, aguarde sua vez.');
    }
  }
}