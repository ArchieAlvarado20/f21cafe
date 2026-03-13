<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $main = $_POST['main'];
    $updated_at = date("Y-m-d H:i:s");

    $sql = "UPDATE category SET name=?, updated_at=? , main = ? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssii", $name,  $updated_at, $main, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating item']);
    }

    $stmt->close();
    $conn->close();
}
?>