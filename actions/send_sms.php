<?php
// send_sms.php
header('Content-Type: application/json');

// Sensitive info dito lang sa PHP
$API_KEY = "47ec18a9-cfb0-4072-a4d6-868db5a1fdc8";
$DEVICE_ID = "69ad36aa937185499c44e77a";
$owners = ["+639927270042"];

// Kunin message mula sa POST
$data = json_decode(file_get_contents('php://input'), true);
$message = $data['message'] ?? '';

if (!$message) {
    echo json_encode(["status" => "error", "message" => "No message provided"]);
    exit;
}

// Forward request to TextBee API
$payload = json_encode([
    "recipients" => $owners,
    "message" => $message
]);

$options = [
    "http" => [
        "header" => "Content-type: application/json\r\n" .
                    "x-api-key: $API_KEY\r\n",
        "method" => "POST",
        "content" => $payload
    ]
];

$context = stream_context_create($options);
$result = file_get_contents("https://api.textbee.dev/api/v1/gateway/devices/$DEVICE_ID/send-sms", false, $context);

if ($result === FALSE) {
    echo json_encode(["status" => "error", "message" => "Failed to send SMS"]);
} else {
    echo $result; // JSON response from TextBee
}