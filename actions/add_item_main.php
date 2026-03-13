<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $category = $_POST['category'];
    // $price = $_POST['price'];
    // $stock = $_POST['stock'];
    $main = 1;

    $sql = "INSERT INTO inventory (item_name, category, main) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $name, $category, $main);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding item']);
    }
    
    $stmt->close();
    $conn->close();
}
?>