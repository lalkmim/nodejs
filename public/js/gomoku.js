$(document).ready(function() {
  desenharTabuleiro($('#mesa')[0], 40, 30);
  
  now.ready(function() {
    atualizarComboSalas();
    
    $('#select_salas').live('change', function(dados) {
      if(this.selectedIndex == 1) {
        this.disabled = true;
        now.criarSala();
      } else if(this.selectedIndex > 1) {
        this.disabled = true;
        now.entrarSala(this.options[this.selectedIndex].value);
      }
    });
    
    now.msg = function(texto) {
      $('#mensagem').append(texto);
      $('#mensagem').append('<br/>');
    }
  });
});
  
function desenharTabuleiro(div, linhas, colunas) {
  var table = $(document.createElement('table')).attr('id', 'tabuleiro')[0];
  
  div.appendChild(table);
  
  for(var i=0; i<linhas; i++) {
    var linha = table.insertRow();
    for(var j=0; j<colunas; j++) {
      var celula = linha.insertCell();
      celula.style.cursor = 'pointer';
      celula.textAlign = 'center';
      celula.onclick = cellClickHelper(i, j);
    }
  }
}
  
function cellClickHelper(i, j) {
  return function() {
    if(now.vez == now.player) {
      $('#tabuleiro')[0].rows[i].cells[j].innerText(now.simbolo);
      now.vez = 1 - now.vez;
    } else {
      alert('Por favor, aguarde sua vez.');
    }
  }
}

function atualizarComboSalas() {
  var opts = $('#select_salas').attr('options');
  
  for(var i=0; i<now.listaSalasDisponiveis; i++) {
    var sala = now.listaSalasDisponiveis[i];
    opts[opts.length] = new Option(sala, sala.id, true, true);
  }
}