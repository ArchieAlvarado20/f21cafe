<?php
include 'db_connect.php';
header('Content-Type: application/json');

// --- Inventory Main ---
$sql1 = "SELECT id, item_name as name, category, price, stock 
         FROM inventory 
         WHERE status='' AND main=1 
         ORDER BY id ASC";
$res1 = $conn->query($sql1);

$data = [];

while($row = $res1->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $row['price'] = (float)$row['price'];
    $row['stock'] = (int)$row['stock'];

    $stock_id = $row['id'];

    // --- Get total qty and current price from last stock add ---
    $sql2 = "SELECT SUM(qty) AS total_qty, price AS current_price
             FROM stocks
             WHERE stock_id = $stock_id
             ORDER BY id DESC
             LIMIT 1";
    $res2 = $conn->query($sql2);
    $sumRow = $res2->fetch_assoc();

    $row['total_qty'] = (int)($sumRow['total_qty'] ?? 0);
    // current_price = price ng last stock add
    $sql3 = "SELECT price FROM stocks WHERE stock_id = $stock_id ORDER BY id DESC LIMIT 1";
    $res3 = $conn->query($sql3);
    $lastPriceRow = $res3->fetch_assoc();
    $row['current_price'] = (float)($lastPriceRow['price'] ?? $row['price']);

    $data[] = $row;
}

echo json_encode($data);

$conn->close();
?>