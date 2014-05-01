function processData(data,y_label){
	var length = data.length;
	var date = new Array(length+1);
	var count = new Array(length+1);
	
	date[0] = 'x';
	count[0] = y_label;
	for(i = 1; i <=length; ++i){	
		count[i] = data[i-1].value; 
		date[i] = formatDate(data[i-1].key,'.');
	}
	
	return [date,count]
}

function formatDate(date,delimiter){
	var result;
	result = date.substring(0,date.indexOf(delimiter));
	document.write(result);
	return result;
}
