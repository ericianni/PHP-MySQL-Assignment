window.onload = function() {
    request('load&filter=all');
    localStorage.setItem('filter', 'all');
};

function request(action) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }

    if (xmlhttp) {
        xmlhttp.open('GET', 'videostore.php?action=' + action, true);
        xmlhttp.send();
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var temp = JSON.parse(xmlhttp.responseText);
            localStorage.setItem('videos', JSON.stringify(temp[0]));
            localStorage.setItem('categories', JSON.stringify(temp[1]));
            display();
            emptyElements('selectCategory', 'menu');
            populateCategories();
        }
    };
}

function display() {
    var videos = JSON.parse(localStorage.getItem('videos'));
    var container = document.getElementById('videos');
    var video;
    var videoName;
    var length;
    var category;
    var deleteButton;
    for (var prop in videos) {
        video = document.createElement('div');
        video.setAttribute('id', videos[prop]['id']);
        video.setAttribute('class', 'video');
        videoName = document.createElement('div');
        videoName.setAttribute('id', videos[prop]['name']);
        videoName.setAttribute('class', 'videoName');
        videoName.textContent = videos[prop]['name'];
        category = document.createElement('div');
        category.setAttribute('class', 'category');
        category.textContent = videos[prop]['category'];
        length = document.createElement('div');
        length.setAttribute('class', 'length');
        length.textContent = videos[prop]['length'] + ' mins';
        deleteButton = document.createElement('div');
        deleteButton.setAttribute('class', 'delete');
        deleteButton.setAttribute('onclick', 'deleteFunction(this.parentNode)');
        deleteButton.innerHTML = 'Delete';
        rentButton = document.createElement('div');
        rentButton.setAttribute('onclick', 'flipRent(this.parentNode)');
        var rented = videos[prop]['rented'];
        if (rented == 1) {
            rentButton.innerHTML = 'Return';
            rentButton.setAttribute('class', 'rented');
        } else {
            rentButton.innerHTML = 'Rent';
            rentButton.setAttribute('class', 'rent');
        }
        video.appendChild(videoName);
        video.appendChild(category);
        video.appendChild(length);
        video.appendChild(deleteButton);
        video.appendChild(rentButton);
        container.appendChild(video);
    }
}

function add(form) {
    var name = encodeURI(form.name.value);
    var category = encodeURI(form.category.value);
    var filter = encodeURI(localStorage.getItem('filter'));
    var length = form.length.value;
    if (name == null || name == '') {
        alert('Please input a name.');
        return;
    } else {
        if (category == null || category == '') {
            alert('Please input a category.');
            return;
        } else {
            if (length == null || length == "") {
                alert('Please input an integer greater than 0.');
                return;
            }
        }
    }
    var statement = 'add&name=' + name + '&category=' +
        category + '&length=' + length + '&filter=' +
        filter;
    emptyElements('videos', 'video');
    request(statement);
}

function deleteFunction(elem) {
    var videos = JSON.parse(localStorage.getItem('videos'));
    if (videos.length == 1) {
        localStorage.setItem('filter', 'all');
    }
    var filter = encodeURI(localStorage.getItem('filter'));
    var statement = 'delete&id=' + elem.id + '&filter=' +
        filter;
    emptyElements('videos', 'video');
    request(statement);
}

function flipRent(elem) {
    var rented;
    if (elem.childNodes[4].textContent == 'Return') {
        rented = 0;
    } else {
        rented = 1;
    }
    var filter = encodeURI(localStorage.getItem('filter'));
    var statement = 'rent&id=' + elem.id + '&rented=' + rented +
        '&filter=' + filter;
    emptyElements('videos', 'video');
    request(statement);
}


function filter(selection) {
    localStorage.setItem('filter', selection);
    var statement = 'sort&filter=' + encodeURI(selection);
    emptyElements('videos', 'video');
    request(statement);
}

function deleteAll() {
    localStorage.setItem('filter', 'all');
    var statement = 'deleteAll';
    emptyElements('videos', 'video');
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

/*function updateCategories() {
    request('categories');
}*/

function populateCategories() {
    var container = document.getElementById('selectCategory');
    var categories = JSON.parse(localStorage.getItem('categories'));
    var choice;
    var select = document.createElement('select');
    select.setAttribute('class', 'menu');
    select.setAttribute('id', 'select');
    select.setAttribute('onchange', 'filter(this.value)');
    choice = document.createElement('option');
    choice.setAttribute('value', 'genre');
    choice.textContent = 'Select Genre';
    select.appendChild(choice);
    choice = document.createElement('option');
    choice.setAttribute('value', 'all');
    choice.textContent = 'All Movies';
    select.appendChild(choice);

    for (var prop in categories) {
        choice = document.createElement('option');
        choice.setAttribute('value', categories[prop]);
        choice.textContent = categories[prop];
        select.appendChild(choice);
    }
    container.appendChild(select);
}

