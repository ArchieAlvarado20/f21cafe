<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $status = $_POST['status'];          // ex: "deleted"
    $deleted_at = $_POST['deleted_at'];  // ex: current timestamp
    $id = $_POST['id'];

    // Correct query: update only status and deleted_at
    $sql = "UPDATE category SET status = ?, deleted_at = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);

    // Correct binding: string, string, integer
    $stmt->bind_param("ssi", $status, $deleted_at, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item soft deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting item']);
    }

    $stmt->close();
    $conn->close();
}
?>
