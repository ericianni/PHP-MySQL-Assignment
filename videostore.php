<?php 
	include 'login.php';

	$table = 'TEST';
	$mysqli = new mysqli($host, $user, $pwd, $databaseName);
	if ($mysqli->connect_errno) {
    	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
	}
	/**
	 * Adds a video using the passed GET values
	 * @param [string] $table  [name of database]
	 * @param [mysqli connection] $mysqli [holds the videos in database]
	 */
	function add($table, $mysqli) {
		$name = $_GET['name'];
		$length = $_GET['length'];
		$category = $_GET['category'];
		$rented = 0;
		$add = $mysqli->prepare("INSERT INTO $table(name, category, length, rented) VALUES (?, ?, ?, ?)");
		$add->bind_param('ssii', $name, $category, $length, $rented);
		$add->execute();
		$add->close();
	}

	/**
	 * dels a video using the passed GET values
	 * @param [string] $table  [name of database]
	 * @param [mysqli connection] $mysqli [holds the videos in database]
	 */
	function del($table, $mysqli) {
		$del = $mysqli->prepare("DELETE FROM $table WHERE id = ?");
		$del->bind_param('i', $_GET['id']);
		$del->execute();
		$del->close();
	}

	/**
	 * Updates the rented state of a video passed by GET
	 * @param [string] $table  [name of database]
	 * @param [mysqli connection] $mysqli [holds the videos in database]
	 */
	function rent($table, $mysqli) {
		$rent = $mysqli->prepare("UPDATE $table SET rented = ? WHERE id = ?");
		$rent->bind_param('ii', $_GET['rented'], $_GET['id']);
		$rent->execute();
		$rent->close();
	}

	/**
	 * Applies a filter to the returned rows of the database
	 * Returns results as a JSON object
	 * @param [string] $table  [name of database]
	 * @param [mysqli connection] $mysqli [holds the videos in database]
	 */
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

	/**
	 * Deletes all values from the database
	 * @param [string] $table  [name of database]
	 * @param [mysqli connection] $mysqli [holds the videos in database]
	 */
	function deleteAll($table, $mysqli) {
		$mysqli->query("TRUNCATE TABLE $table");
	}

	/**
	 * This switch calls the appropriate action
	 */
	$action = $_GET['action'];
	switch ($action) {
		case 'add':
			add($table, $mysqli);
			break;
		case 'delete':
			del($table, $mysqli);
			break;
		case 'rent':
			rent($table, $mysqli);
			break;
		case 'deleteAll':
			deleteAll($table, $mysqli);
			break;
		default:
			# code...
			break;
	}
	filter($table, $mysqli);
 ?>