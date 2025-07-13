<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $sql = "SELECT id, name FROM card_categories ORDER BY name";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $categories = $stmt->fetchAll();
    
    echo json_encode($categories);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>