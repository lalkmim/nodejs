$(document).ready(function() {
  $('#select_salas').attr('disabled', 'disabled');
  desenharTabuleiro($('#mesa')[0], 20, 20);
  
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
    
    now.msg = function(texto, id) {
      if(arguments.length < 2)
        id = '#mensagem';
      $(id).append('<span>&gt;&gt;&gt; ' + texto + '</span><br/>');
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
      
    now.informarVez = function(simbolo, buscaId) {
      $(buscaId).text(simbolo);
      $(buscaId).unbind('click');
      
      var ganhou = verificaVencedor(buscaId, simbolo);
      
      if(ganhou) {
        if(now.vez == now.player) {
          alert('Você perdeu!');
        } else {
          alert('Você ganhou!');
        }
        $('#tabuleiro td').unbind('click');
      } else if(now.vez == now.player) {
        now.msg('Sua vez!', '#aviso');
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
    var linha = table.insertRow(i);
    for(var j=0; j<colunas; j++) {
      var celula = linha.insertCell(j);
      celula.id = 'cell_' + i + '_' + j;
      $('#' + celula.id).bind('click', cellClickHelper(i, j));
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
      now.atualizarVez(now.sala, now.simbolo, busca_id, 1 - now.vez);
    } else {
      alert('Por favor, aguarde sua vez.');
    }
  }
}

function verificaVencedor(buscaId, simbolo) {
  var i = parseInt(buscaId.split('_')[1], 10);
  var j = parseInt(buscaId.split('_')[2], 10);
  
  return (verificaVertical(i, j, simbolo) || verificaHorizontal(i, j, simbolo) || verificaDiagonais(i, j, simbolo));
}

function verificaVertical(i, j, simbolo) {
  var contador = max = 0;
  
  for(var k=i-4; k<i+4; k++) {
    var id = '#cell_' + k + '_' + j;
        
    if($(id).length == 0)
      continue;
        
    ($(id).text() == simbolo ? contador++ : contador = 0);
    
    max = (contador > max ? contador : max);
  }
      
  return (max >= 5);
}

function verificaHorizontal(i, j, simbolo) {
  var contador = max = 0;
  
  for(var k=j-4; k<j+4; k++) {
    var id = '#cell_' + i + '_' + k;
    
    if($(id).length == 0)
      continue;

    ($(id).text() == simbolo ? contador++ : contador = 0);
    
    max = (contador > max ? contador : max);
  }
      
  return (max >= 5);
}

function verificaDiagonais(i, j, simbolo) {
  var contador = max = 0;
  
  for(var k=-4; k<5; k++) {
    var id = '#cell_' + (i+k) + '_' + (j+k);
    
    if($(id).length == 0)
      continue;
        
    ($(id).text() == simbolo ? contador++ : contador = 0);
    
    max = (contador > max ? contador : max);
  }
  
  for(var k=-4; k<5; k++) {
    var id = '#cell_' + (i+k) + '_' + (j-k);
    
    if($(id).length == 0)
      continue;
    
    ($(id).text() == simbolo ? contador++ : contador = 0);
    
    max = (contador > max ? contador : max);
  }
      
  return (max >= 5);
}