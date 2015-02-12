window.onload = function() {
	request('load');
}

function request (action) {
	var xmlhttp;
	if (window.XMLHttpRequest) {
	    // code for IE7+, Firefox, Chrome, Opera, Safari
	    xmlhttp = new XMLHttpRequest();
	} else {
	    // code for IE6, IE5
	    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if(xmlhttp) {
		xmlhttp.open("GET","videostore.php?action=" + action, true);
		xmlhttp.send();
	}

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if(action == 'categories') {
				localStorage.setItem('categories', xmlhttp.responseText);
				emptyElements('selectCategory', 'menu');
				populateCategories();
			} else {
				localStorage.setItem('videos', xmlhttp.responseText);
				display();
				emptyElements('selectCategory', 'menu');
				populateCategories();
			}
		}
	}
}

function display() {
	var videos = JSON.parse(localStorage.getItem('videos'));
	var container = document.getElementById('videos');
	var video;
	var deleteButton;
	for (var prop in videos) {
		video = document.createElement('div');
		video.setAttribute('id', videos[prop]['id']);
		video.setAttribute('class', 'video');
		video.innerHTML = videos[prop]['name'];
		deleteButton = document.createElement('div')
		deleteButton.setAttribute('class', 'delete');
		deleteButton.setAttribute('onclick', 'deleteFunction(this.parentNode)');
		deleteButton.innerHTML = 'Delete';
		rentButton = document.createElement('div')
		rentButton.setAttribute('onclick', 'flipRent(this.parentNode)');
		var rented = videos[prop]['rented'];
		//console.log(rented);
		if(rented == 1) {
			rentButton.innerHTML = 'Return';
			rentButton.setAttribute('class', 'rented');
		} else {
			rentButton.innerHTML = 'Rent';
			rentButton.setAttribute('class', 'rent');
		}
		
		video.appendChild(deleteButton);
		video.appendChild(rentButton);
		container.appendChild(video);
	}
}

function add(form) {
	var name = form.name.value;
	var category = form.category.value;
	var length = form.length.value;
	var statement = "add&name="+name+"&category="+category+"&length="+length;
	emptyElements('videos', 'video');
	request(statement);
	updateCategories();
}

function deleteFunction(elem) {
	console.log(elem.id);
	var statement = "delete&id=" + elem.id;
	emptyElements('videos', 'video');
	request(statement);
	updateCategories();
}

function flipRent(elem) {
	var rented;
	if(elem.childNodes[2].innerHTML == 'Return') {
		rented = 0;
	} else {
		rented = 1;
	}
	var statement = 'rent&id=' + elem.id + '&rented=' + rented;
	emptyElements('videos', 'video');
	console.log(statement);
	request(statement);
}

function emptyElements(elem, type) {
	var container = document.getElementById(elem);
	var elements = document.getElementsByClassName(type);
	var id;
	while (elements.length) {
		id = elements[0].id;
		container.removeChild(document.getElementById(id));
	}
}

function updateCategories() {
	request('categories');

}

function populateCategories() {
	var container = document.getElementById('selectCategory');
	var categories = JSON.parse(localStorage.getItem('categories'));
	var choice;
	var select = document.createElement('select');
	select.setAttribute('class', 'menu');
	select.setAttribute('id', 'select');
	for(var prop in categories) {
		choice = document.createElement('option');
		choice.setAttribute('value', categories[prop]);
		choice.innerHTML = categories[prop];
		select.appendChild(choice);
	}
	container.appendChild(select);
}