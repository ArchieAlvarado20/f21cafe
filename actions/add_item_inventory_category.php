<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $main = $_POST['main'];
    $created_at = date("Y-m-d H:i:s");

    $sql = "INSERT INTO category (name, created_at, main) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $name, $created_at, $main);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding item']);
    }
    
    $stmt->close();
    $conn->close();
}
?>