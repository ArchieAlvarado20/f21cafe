<?php
require "db_connect.php"; // adjust path sa db connection mo

header("Content-Type: application/json");

$main = isset($_GET['main']) ? intval($_GET['main']) : null;

if ($main !== null) {
    $stmt = $conn->prepare("SELECT id, name, main, created_at FROM category WHERE main = ? AND status = ''");
    $stmt->bind_param("i", $main);
} else {
    $stmt = $conn->prepare("SELECT id, name, main, created_at FROM category WHERE status = ''");
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
