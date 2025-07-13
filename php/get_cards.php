<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    if (strlen($search) < 2) {
        echo json_encode([]);
        exit;
    }
    
    $sql = "SELECT id, name, element FROM cards 
            WHERE (name LIKE :search OR id LIKE :search_id) 
            AND id NOT LIKE '%000' AND id NOT LIKE '%001'
            ORDER BY name 
            LIMIT 20";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':search' => '%' . $search . '%',
        ':search_id' => $search . '%'
    ]);
    
    $cards = $stmt->fetchAll();
    
    echo json_encode($cards);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>