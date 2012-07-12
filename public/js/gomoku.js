$(document).ready(function() {
  desenharTabuleiro($('#mesa')[0], 40, 30);
  
  now.ready(function() {
    $('#select_salas').live('change', function(dados) {
      if(this.selectedIndex != 0) {
        this.disabled = true;
        now.entrarSala(this.options[this.selectedIndex].value);
      }
    });
    
    now.receberJogada = function(dados) {
      var nome = '';
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