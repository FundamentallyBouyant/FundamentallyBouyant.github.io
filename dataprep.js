var lines= document.getElementsByTagName('p');
var parsedData = [];
var row =[];
var department = '';
var code = '';
var desc = '';
var rate = '';

for(var i=0;i<lines.length;i++){
	desc = '"';
	row = [];
	var line = lines[i].innerHTML.replace(/\n|<br>|#|<!--[\s\S]*?-->/g,'');
	console.log(line);
	line = line.split('&amp;').join('&');
	line = line.split('&lt;').join('<');
	line = line.split('&gt;').join('>');
	if(line.search("ACCOMMODATION")>=0){
		break;
	}
	lineArray = line.split('&nbsp;');
	var data = [];
	var splitData = [];

	lineArray.forEach(function(el){
		if (el.match(/[0-9a-zA-Z]/i)){
     	data.push(el);
		}
	});
	
	if(data.length>0){
		if(data[0].search('DEPARTMENT OF')>=0){
			department = data[0].slice(data[0].search('DEPARTMENT OF')+13).trim();;
		} else if(data.length>1 && data[0].search('CODE')<0){
			code = data[0].trim();
			if(code.split(' ').length>1){
				code = code.split(' ')[0];
			}
			for(var k=0;k<data.length;k++){
				splitData = splitData.concat(data[k].split(' '));
			}
			for(var j=1;j<splitData.length-1;j++){
				desc+= splitData[j].trim()+' ';
			}
			desc+='"'
			rate = data[data.length-1].trim();
			row.push(department,code,desc.trim(),rate);
			parsedData.push(row);
		}	
	}
}

var csvContent = "data:text/csv;charset=utf-8,";
parsedData.forEach(function(infoArray, index){
   dataString = infoArray.join(",");
   csvContent += index < parsedData.length ? dataString + "\n" : dataString;
}); 

var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "my_data.csv");
document.body.appendChild(link);
link.click();