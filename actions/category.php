<?php
include('db_connect.php');
header('Content-Type: application/json');

$sql = "SELECT
  id,
  name,
  created_at,
  updated_at,
  deleted_at,
  main
FROM category
WHERE status = '' 
ORDER BY id DESC";

$result = $conn->query($sql);
$items = [];

if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $row['main'] = (int)$row['main'];
    $items[] = $row;
  }
}
echo json_encode($items);
$conn->close();
