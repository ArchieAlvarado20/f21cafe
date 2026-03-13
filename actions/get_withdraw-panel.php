<?php
include 'db_connect.php';

header('Content-Type: application/json');

    $sql = "
    SELECT 
    stocks.id AS id,
    stocks.stock_id,
    stocks.batch_no,
    stocks.created_at,
    stocks.expiry_date,
    stocks.qty,
    stocks.price AS stock_price,

    inventory.item_name AS name,
    inventory.category AS category,
    inventory.price AS main_price
    FROM stocks
    LEFT JOIN inventory 
        ON stocks.stock_id = inventory.id
    WHERE inventory.status = '' 
        AND inventory.main = 1 AND stocks.qty >= 1
    ORDER BY stocks.id ASC
    ";

$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        $row['stock_row_id'] = (int)$row['id'];
        $row['stock_id'] = (int)$row['stock_id'];
        $row['qty'] = (int)$row['qty'];
        $row['price'] = (float)$row['stock_price'];
        $row['expiry_date'] = (string)$row['expiry_date'];
        $row['batch_no'] = (string)$row['batch_no'];

        $data[] = $row;
    }
}

echo json_encode($data);
$conn->close();
?>