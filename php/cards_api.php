<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$action = $_GET['action'] ?? '';

switch($action) {
    case 'search':
        searchCards();
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}

function searchCards() {
    $pdo = $GLOBALS['pdo'];
    
    $search = $_GET['search'] ?? '';
    $limit = min((int)($_GET['limit'] ?? 20), 50); // Maximum 50 cartes par page
    $offset = max((int)($_GET['offset'] ?? 0), 0);
    
    try {
        $searchCondition = '';
        $params = [];
        
        if (!empty($search)) {
            $searchCondition = "WHERE (name LIKE :search OR id LIKE :search_id)";
            $params[':search'] = '%' . $search . '%';
            $params[':search_id'] = $search . '%';
        }
        
        $countSql = "SELECT COUNT(*) FROM cards $searchCondition";
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();
        
        $sql = "SELECT id, name, rarity, element, cost 
                FROM cards 
                $searchCondition 
                ORDER BY CAST(id AS UNSIGNED) ASC 
                LIMIT :limit OFFSET :offset";
        
        $stmt = $pdo->prepare($sql);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        $cards = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'cards' => $cards,
            'total' => (int)$total,
            'limit' => $limit,
            'offset' => $offset
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
    }
}
?>