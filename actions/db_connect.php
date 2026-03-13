<?php
// Database connection settings
$host = "localhost";      
$user = "root";           
$pass = "";               
$dbname = "f21_cafe";     

//infinity free
// $host = "sql202.infinityfree.com";      
// $user = "if0_41379736";           
// $pass = "Ellengay1";               
// $dbname = "if0_41379736"; 

//Award Space
// $host = "fdb1033.awardspace.net";      
// $user = "4658823_aespresso";           
// $pass = "Ellengay1";               
// $dbname = "4658823_aespresso"; 

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>