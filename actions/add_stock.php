<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stock_id = $_POST['stock_id'];
    $batch_no = $_POST['batch_no'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    $qty = $_POST['qty'];
    $expiry_date = $_POST['expiry_date'];
    $created_at = date("Y-m-d H:i:s");

    $sql = "INSERT INTO stocks (stock_id, description, batch_no, price, qty, expiry_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issdiss", $stock_id, $description, $batch_no, $price, $qty, $expiry_date, $created_at);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding item']);
    }

    $stmt->close();
    $conn->close();
}
?>