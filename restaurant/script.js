tables = [];
menu = JSON.parse(menuData);

function addTables(n){
	var table = {};
	for(var i=0;i<n;i++){
		table = {
			id: tables.length+1,
			orderItems : []
		}
		tables.push(table);
	}
}


// ondrop="drop(event)" ondragover="allowDrop(event)"></div>

// <img id="drag1" src="img_logo.gif" draggable="true"
// ondragstart="drag(event)"

function populateTables(){
	addTables(3);
	var div,h,p;
	tables.forEach(function(table){
		div = document.createElement('div');
		div.className = 'table';
		div.setAttribute('draggable',true);;
		div.id = 'table'+table.id;
		h = document.createElement('h4');
		h.innerHTML = 'Table '+table.id;
		p = document.createElement('p');
		p.innerHTML = 'Items 0 Cost : 0';
		div.appendChild(h);
		div.appendChild(p);
		div.addEventListener('click',function(){showBill(table.id);});
		div.addEventListener('drop',function(event){drop(event);});
		div.addEventListener('dragover',function(event){allowDrop(event);});
		document.getElementById('tables').appendChild(div);
	});	
}

function populateMenu(){
	var div,h,p;
	menu.forEach(function(item){
		div = document.createElement('div');
		div.className = 'item '+item.type;
		div.setAttribute('draggable',true);
		div.id = 'item'+item.id;
		h = document.createElement('h4');
		h.innerHTML = 'item'+item.id;
		p = document.createElement('p');
		p.innerHTML = item.name + '<span>Cost : '+item.cost+'</span>';
		div.appendChild(h);
		div.appendChild(p);
		div.addEventListener('dragstart',function(event){drag(event);});
		document.getElementById('menu').appendChild(div);
	});
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var itemId = ev.dataTransfer.getData("text");
    var item = menu.find(x => x.id == itemId.slice(4));
    console.log(item);
    var tableId = ev.target.id.slice(5);

    tables[tableId-1].orderItems.push(item);
    console.log(tables);
    updateTable(ev.target.id);
}

function getTotal(table){
	var total = 0;
	table.orderItems.forEach(function(item){
		total += item.cost;
	})
	return total;
}

function updateTable(tableId){
	var table = tables.find(x => x.id == tableId.slice(5));
	var cost = getTotal(table);
	var noOfItems = table.orderItems.length;
	document.getElementById(tableId).querySelector('p').innerHTML = 'Items '+noOfItems+' Cost : '+cost;
}

function searchMenu(){
	var searchString = document.getElementById('menu-search').value;
	var menuDivs = document.getElementById('menu').getElementsByTagName('div');
	var div;
	for(var i=0;i<menuDivs.length;i++){
		div = menuDivs[i];
		if(searchString.length && div.className.search(searchString)<0 && div.getElementsByTagName('p')[0].innerHTML.toLowerCase().search(searchString.toLowerCase())){
			div.style.display = 'none';
		} else {
			div.style.display = 'block';
		}
	}
}

function searchTable(){
	var searchString = document.getElementById('table-search').value;
	var tableDivs = document.getElementById('tables').getElementsByTagName('div');
	var div;
	for(var i=0;i<tableDivs.length;i++){
		div = tableDivs[i];
		if(searchString.length && div.id.search(searchString)<0){
			div.style.display = 'none';
		} else {
			div.style.display = 'block';
		}
	}
}



function showBill(id){
	document.getElementById('table'+id).style.backgroundColor = 'orange';
	document.getElementById('table-no').innerHTML = 'Table '+id+' | Order details';
	var table = tables.find(x => x.id == id);
	console.log(table);
	var items = [];
	var repeat;
	for(var i=0;i<table.orderItems.length;i++){
		repeat = false;
		items.forEach(function(item){
			console.log(item);
			if(item.id == table.orderItems[i].id){
				item.quantity++;
				item.cost=table.orderItems[i].cost;
				repeat = true;
			}
		});
		if(!repeat){
			items.push({
				id:table.orderItems[i].id,
				name:table.orderItems[i].name,
				quantity:1,
				cost:table.orderItems[i].cost,
			});	
		}
	}
	document.getElementById('bill-table').querySelector('tbody').innerHTML='';
	var count = 1;
	var row;
	console.log(items);
	items.forEach(function(item){
		row = '<tr id="bill-item-'+(id)+'-'+count+'-'+item.id+'"><td>'+count+'</td><td>'+item.name+'</td><td>'+item.cost+'</td><td><input type="number" id="quantity'+count+'" min="1" value="'+item.quantity+'"></td></tr>';
		document.getElementById('bill-table').querySelector('tbody').innerHTML+=row;
		console.log(count);
		// document.getElementById('quantity'+count).addEventListener('change',function(){updateBill();});
		// document.getElementById('quantity'+count).addEventListener('keyup',function(){updateBill();});
		count++;
	});
	document.getElementById('bill-table').addEventListener('change',function(){updateBill();});
	document.getElementById('bill-table').addEventListener('keyup',function(){updateBill();});
	document.getElementById('modal-container').style.display = 'block';
	document.getElementById('bill-total').innerHTML = 'Total : '+getTotal(table);
	document.getElementById('generate-bill').addEventListener('click',function(){
		tables[id-1] = {
			id:id,
			orderItems:[]
		};
		updateTable('table'+id);
		console.log(tables);
		var old_element = document.getElementById("generate-bill");
		var new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);
		document.getElementById('modal-container').style.display = 'none';
		document.getElementById('table'+id).style.backgroundColor = 'white';
	})
	document.getElementById('close-button').addEventListener('click',function close(){
		document.getElementById('modal-container').style.display = 'none';
		document.getElementById('table'+id).style.backgroundColor = 'white';
		var old_element = document.getElementById("generate-bill");
		var new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);
});

}

function updateBill(){
	var trows = document.getElementById('bill-table').querySelector('tbody').getElementsByTagName('tr');
	var table ={};
	console.log(trows);
	table.id = trows[0].id.split('-')[2];
	table.orderItems = [];
	for(i=0;i<trows.length;i++){
		var id = trows[i].id;
		var dishInfo = id.split('-');
		var tableId = dishInfo[2];
		var itemId = dishInfo[4];
		var quantity = trows[i].querySelector('input').value;
		item = menu.find(x => x.id == itemId);
		for(var j=0;j<quantity;j++){
			table.orderItems.push(item);
		}
	}
	tables[table.id-1] = table;
	updateTable('table'+table.id);
	document.getElementById('bill-total').innerHTML = 'Total : Rs.'+getTotal(table);

}

document.getElementById('menu-search').addEventListener('keyup',function(){searchMenu();});
document.getElementById('table-search').addEventListener('keyup',function(){searchTable();});
populateTables();
populateMenu();