<?php 
	$mysqli = new mysqli("oniddb.cws.oregonstate.edu", "iannie-db", "6kRBxp0O6k2hf4rb", "iannie-db");
	if ($mysqli->connect_errno) {
    	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
	}

	$results = $mysqli->query("SELECT * FROM TEST");
	$list = array();
	while($row = $results->fetch_assoc())
	{
		array_push($list, $row);
	}
	echo json_encode($list);
 ?>