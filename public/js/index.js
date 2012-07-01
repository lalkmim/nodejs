var socket = null;
      
$(document).ready(function() {
	$('#div_texto').css('display', 'none');
	$('#div_conectar').css('display', 'block');
	
	$('#but_ok').live('click', function() {
		socket.emit('chat', { 
			msg: $('#texto').val(),
			dataHora: formatHour(new Date()),
			autor: $('#nome').val() });
	});
	
	$('#but_conectar').live('click', function() {
		$('#but_conectar').attr('disabled', 'disabled');
		$('#but_conectar').attr('value', 'Conectando...');
		
		socket = io.connect(window.location.href);
		socket.on('chat', function (data) {
			$('#div_conectar').css('display', 'none');
			$('#div_texto').css('display', 'block');
		
			console.log(data);
			$('#chat').append('<br/>[');
			$('#chat').append(data.dataHora);
			$('#chat').append('] ');
			$('#chat').append(data.autor);
			$('#chat').append(': ');
			$('#chat').append(data.msg);
		});
	});
	
	$('#texto').keypress(function(e) {
        if(e.which == 13 || e.keyCode == 13) {
            $('#but_ok').click();
        }
    });
});