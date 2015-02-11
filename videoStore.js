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
			localStorage.setItem('videos', xmlhttp.responseText);
			display();
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
		rentButton.setAttribute('class', 'rent');
		rentButton.setAttribute('onclick', 'flipRent(this.parentNode)');
		var rented = JSON.parse(localStorage.getItem('rented'));
		if(rented) {
			rentButton.innerHTML = 'Return';	
		} else {
			rentButton.innerHTML = 'Rent';
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
	emptyElements('videos');
	request(statement);
}

function deleteFunction(elem) {
	console.log(elem.id);
	var statement = "delete&id=" + elem.id;
	emptyElements('videos');
	request(statement);
}

function flipRent(elem) {
	console.log(elem.id);
	var statement = 'rent&id=' + elem.id;
	emptyElements('videos');
	request(statement);
}

function emptyElements(elem) {
	var container = document.getElementById(elem);
	var elements = document.getElementsByClassName('video');
	var id;
	while (elements.length) {
		id = elements[0].id;
		container.removeChild(document.getElementById(id));
	}
}