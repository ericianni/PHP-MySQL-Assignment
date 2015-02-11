<?php 
	$table = 'TEST';
	$mysqli = new mysqli("oniddb.cws.oregonstate.edu", "iannie-db", "6kRBxp0O6k2hf4rb", "iannie-db");
	if ($mysqli->connect_errno) {
    	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
	}

	function add($table, $mysqli) {
		$name = $_GET['name'];
		$length = $_GET['length'];
		$category = $_GET['category'];
		$rented = 0;
		$insert = $mysqli->prepare("INSERT INTO $table(name, category, length, rented) VALUES (?, ?, ?, ?)");
		$insert->bind_param('ssii', $name, $category, $length, $rented);
		$insert->execute();
		show($table, $mysqli);
	}

	function del($table, $mysqli) {
		$insert = $mysqli->prepare("DELETE FROM $table WHERE id = ?");
		$insert->bind_param('i', $_GET['id']);
		$insert->execute();
		show($table, $mysqli);
	}

	function rent($table, $mysqli) {
		$insert = $mysqli->prepare("UPDATE $table SET rented = ? WHERE id = ?");
		$insert->bind_param('ii', 1, $_GET['id']);
		$insert->execute();
		show($table, $mysqli);
	}

	function show($table, $mysqli) {
		$results = $mysqli->query("SELECT * FROM $table");
		$list = array();
		while($row = $results->fetch_assoc())
		{
			array_push($list, $row);
		}
		echo json_encode($list);
	}

	if($_GET['action'] === 'load') {
		show($table, $mysqli);
	} else {
		if($_GET['action'] === 'add') {
			add($table, $mysqli);
		} else {
			if($_GET['action'] === 'delete') {
				del($table, $mysqli);
			} else {
				if($_GET['action'] === 'rent') {
					rent($table, $mysqli);
				}
			}
		}
	}
	

 ?>