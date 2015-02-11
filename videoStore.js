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
		}
	}
	display();
}

function display() {
	var videos = JSON.parse(localStorage.getItem('videos'));
	var container = document.getElementById('videos');
	var elem;
	for (var prop in videos) {
		elem = document.createElement('div');
		elem.setAttribute('id', videos[prop]['id']);
		elem.innerHTML = videos[prop]['name'];
		container.appendChild(elem);
	}
}

