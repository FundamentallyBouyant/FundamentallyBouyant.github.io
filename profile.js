
var imgList;

function getImg() {
	imgList = JSON.parse(data);
	return imgList;
}

imgList = getImg();

function renderImg(imgList) {
	imgList.forEach(function(img){
		var imgDiv = document.createElement("div");
		var imgAnchor = document.createElement("a");
		var imgFigure = document.createElement("figure");
		var imgImg = document.createElement("img");
		imgAnchor.href = '#editModal';
		imgDiv.id = "div"+img.id;
		imgDiv.class = "img";
		imgImg.src = img.url;
		imgImg.id = "img"+img.id;
		imgFigure.appendChild(imgImg);
		imgAnchor.appendChild(imgFigure);
		imgDiv.appendChild(imgAnchor);
		console.log(imgDiv);
		imgDiv.addEventListener('click',function(){populateEditModal("div"+img.id)});
		document.getElementById("gallerycontainer").appendChild(imgDiv);
		console.log(img);
	})
}

function populateEditModal(imgId){
	var img = imgList.find(x => x.id === imgId.slice(3));
	// let index = array.indexOf(obj);
	// array.fill(obj.name='some new string', index, index++);
	document.getElementById("editImg").src = img.url;
	document.getElementById("modifyForm").name = img.id;
	var old_element = document.getElementById("deleteImg");
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);
	document.getElementById("deleteImg").addEventListener('click',function del(){console.log(img.id);deleteImg(img.id);});
	return false;
}

function deleteImg(id){
	document.getElementById('div'+id).outerHTML='';
	var img = imgList.find(x => x.id === id);
	imgList.splice(imgList.indexOf(img),1);
}

document.getElementById("modifyForm").onsubmit = function modifyImg(){
	if(validateModifyForm()){
		id = document.getElementById("modifyForm").name;
		var img = imgList.find(x => x.id === id);
		document.getElementById('img'+id).src = document.getElementById('modifyUrl').value;
		imgList[imgList.indexOf(img)].url =document.getElementById('modifyUrl').value;
		imgList[imgList.indexOf(img)].name = document.getElementById('modifyName').value;
		imgList[imgList.indexOf(img)].info = document.getElementById('modifyInfo').value;
		imgList[imgList.indexOf(img)].date = document.getElementById('modifyDate').value;
		console.log('modified'+id);
	} else{
		window.location.href += '#modifyModal';
	}
}

document.getElementById("addForm").onsubmit = function addImg(){
	if(validateAddForm()){
		var tempImg = {};
		if(imgList.length){
		tempImg.id = ''+(parseInt(imgList[imgList.length-1].id)+1)
	} else {
		id = 1;
	}
		console.log();
		tempImg.url= document.getElementById('addUrl').value;
		tempImg.name= document.getElementById('addName').value;
		tempImg.info= document.getElementById('addInfo').value;
		tempImg.date= document.getElementById('addDate').value;
		imgList.push(tempImg);
		renderImg([tempImg]);
		console.log('added'+tempImg.id);
	}else{
		window.location.href += '#modifyModal';
	}
	
}

function validateModifyForm(){
	var urlregex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/;
	var url = document.getElementById('modifyUrl').value;
	if (!urlregex.test(url)) {
  		alert("Enter valid url");
  		return false;
	}
	var dateString= document.getElementById('modifyDate').value;
	var dateregex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
	console.log('aaa');
	if (!dateregex.test(dateString)) {
  		alert("Enter valid date");
  		return false;
	}
	var today = new Date();
  	var date = new Date(dateString.replace( /(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
  	console.log(date);
  	if(date>today){
  		alert("Enter valid date");
  		return false;
  	}
	return true;
}

function validateAddForm(){
	var urlregex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/;
	var url = document.getElementById('addUrl').value;
	if (!urlregex.test(url)) {
  		alert("Enter valid url");
  		return false;
	}
	var dateString= document.getElementById('addDate').value;
	var dateregex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
	console.log('aaa');
	if (!dateregex.test(dateString)) {
  		alert("Enter valid date");
  		return false;
	}
	var today = new Date();
  	var date = new Date(dateString.replace( /(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
  	console.log(date);
  	if(date>today){
  		alert("Enter valid date");
  		return false;
  	}
	return true;
}

renderImg(imgList);