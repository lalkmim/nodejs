$(document).ready(function() {
  desenharTabuleiro($('#mesa')[0], 40, 30);
  
  now.ready(function() {
    now.receberJogada = function(dados) {
      var nome = '';
    }
  });
});
  
function desenharTabuleiro(div, linhas, colunas) {
  var table = $(document.createElement('table')).attr('id', 'tabuleiro');
  
  div.appendChild(table);
  
  for(var i=0; i<linhas; i++) {
    var linha = table.insertRow();
    for(var j=0; j<colunas; j++) {
      var celula = linha.insertCell();
      celula.css('cursor', 'pointer');
      celula.css('text-align', 'center');
      celula.live('click', cellClickHelper(i, j));
    }
  }
}
  
function cellClickHelper(i, j) {
  return function(i, j) {
    if(now.vez == now.player
    $('#tabuleiro').rows[i].cells[j].innerText(now.simbolo);
    now.vez = 1 - now.vez;
  }
}