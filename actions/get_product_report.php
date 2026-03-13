<?php
include 'db_connect.php';
header('Content-Type: application/json');

// SPA-safe: JSON BODY (NOT URL)
$input = json_decode(file_get_contents("php://input"), true);
$itemId = isset($input['item_id']) ? (int)$input['item_id'] : 0;

if ($itemId === 0) {
    echo json_encode([]);
    exit;
}

$sql = "
    SELECT
        item_id,
        item_name,
        price,
        DATE(sale_date) AS sale_day,
        SUM(qty) AS sold_qty,
        SUM(subtotal) AS total_sales,
        ROUND(SUM(subtotal) / SUM(qty), 2) AS avg_price
    FROM product_sales_report
    WHERE item_id = ? AND YEAR(sale_date) = 2026
    GROUP BY item_id
    ORDER BY sale_day asc
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $itemId);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
$conn->close();
