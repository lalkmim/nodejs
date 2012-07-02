function formatHour(dataHora) {
	var that = new Date(dataHora);
	var temp = '';

	if(that.getHours() < 10)
		temp += '0';
		
	temp += that.getHours() + ':';

	if(that.getMinutes() < 10)
		temp += '0';

	temp += that.getMinutes();
		
	return temp;
}