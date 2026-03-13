<?php
include 'db_connect.php';

header('Content-Type: application/json');

$sql = "SELECT id, item_name as name, category, price, deleted_at FROM inventory WHERE status = 'deleted' AND main = 0 ORDER BY deleted_at DESC";
$result = $conn->query($sql);

$items = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['price'] = (float)$row['price'];
        $row['deleted_at'] = $row['deleted_at'];
        $items[] = $row;
    }
}

echo json_encode($items);

$conn->close();
?>