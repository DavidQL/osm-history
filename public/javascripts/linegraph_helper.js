function processData(data){
	var date = new Array(data.length+1);
	var count = new Array(data.length);
	
	date[0] = 'x';
	for(i = 0; i < data.length; ++i){
		if( i == 0 ){
			count[i] = data[i].value; 
		}
		else{
			count[i] = data[i].value;
			date[i] = formatDate(data[i].key,'.');
		}
	}
	
	date[data.length] = formatDate(data[data.length-1].key,'.');
	console.log([date,count]);
	
	return [date,count]
}

function formatDate(date,delimiter){
	var result;
	result = date.substring(0,date.indexOf(delimiter));
	document.write(result);
	
	return result;
}
