<?php 
	include 'login.php';

	$table = 'TEST';
	$mysqli = new mysqli($host, $user, $pwd, $databaseName);
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
		$insert->close();
		//filter($table, $mysqli);
	}

	function del($table, $mysqli) {
		$insert = $mysqli->prepare("DELETE FROM $table WHERE id = ?");
		$insert->bind_param('i', $_GET['id']);
		$insert->execute();
		$insert->close();
		//filter($table, $mysqli);
	}

	function rent($table, $mysqli) {
		$insert = $mysqli->prepare("UPDATE $table SET rented = ? WHERE id = ?");
		$insert->bind_param('ii', $_GET['rented'], $_GET['id']);
		$insert->execute();
		$insert->close();
		//filter($table, $mysqli);
	}

	function filter($table, $mysqli) {
		$filter = urldecode($_GET['filter']);
		$sort = $mysqli->query("SELECT * FROM $table");
		$slist = array();
		while($row = $sort->fetch_assoc())
		{
			if($row['category'] == $filter || $filter == 'all') {
				array_push($slist, $row);
			}
		}
		$categories = $mysqli->query("SELECT category FROM $table");
		$clist = array();
		while($cat = $categories->fetch_assoc()) {
			$found = 0;
			foreach($clist as $thing) {
				if($thing == $cat['category']) {
					$found = 1;
				}
			}
			if(!$found) {
				array_push($clist, $cat['category']);
			}
		}
		$temp = array();
		array_push($temp, $slist);
		array_push($temp, $clist);
		echo json_encode($temp);
	}

	function deleteAll($table, $mysqli) {
		$mysqli->query("TRUNCATE TABLE $table");
		//show($table, $mysqli);
	}

	if($_GET['action'] === 'load') {
		filter($table, $mysqli);
	} else {
		if($_GET['action'] === 'add') {
			add($table, $mysqli);
			filter($table, $mysqli);
		} else {
			if($_GET['action'] === 'delete') {
				del($table, $mysqli);
				filter($table, $mysqli);
			} else {
				if($_GET['action'] === 'rent') {
					rent($table, $mysqli);
					filter($table, $mysqli);
				} else {
					if($_GET['action'] === 'sort') {
						filter($table, $mysqli);
					} else {
						if($_GET['action'] === 'deleteAll') {
							deleteAll($table, $mysqli);
							filter($table, $mysqli);
						}
					}
				}
			}
		}
	}
 ?>