<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'search':
        searchSkills();
        break;
    case 'get_by_ids':
        getSkillsByIds();
        break;
    case 'get_all':
        getAllSkills();
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Action non reconnue']);
}

function searchSkills() {
    global $pdo;
    
    $search = $_GET['search'] ?? '';
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 20)));
    $offset = max(0, (int)($_GET['offset'] ?? 0));
    
    try {
        $sql = "SELECT id, name, description, efficacy_type, eff_value1, eff_value2, eff_value3 
                FROM enemy_skills 
                WHERE 1=1";
        $params = [];
        
        if (!empty($search)) {
            $sql .= " AND (name ILIKE :search OR description ILIKE :search OR id ILIKE :search)";
            $params['search'] = '%' . $search . '%';
        }
        
        $sql .= " ORDER BY name ASC LIMIT :limit OFFSET :offset";
        $params['limit'] = $limit;
        $params['offset'] = $offset;
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $skills = $stmt->fetchAll();
        
        // Compter le total pour la pagination
        $countSql = "SELECT COUNT(*) as total FROM enemy_skills WHERE 1=1";
        $countParams = [];
        
        if (!empty($search)) {
            $countSql .= " AND (name ILIKE :search OR description ILIKE :search OR id ILIKE :search)";
            $countParams['search'] = '%' . $search . '%';
        }
        
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($countParams);
        $total = $countStmt->fetch()['total'];
        
        echo json_encode([
            'skills' => $skills,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur de base de données: ' . $e->getMessage()]);
    }
}

function getSkillsByIds() {
    global $pdo;
    
    $ids = $_GET['ids'] ?? '';
    if (empty($ids)) {
        echo json_encode(['skills' => []]);
        return;
    }
    
    $idArray = array_map('trim', explode(',', $ids));
    $idArray = array_filter($idArray);
    
    if (empty($idArray)) {
        echo json_encode(['skills' => []]);
        return;
    }
    
    try {
        $placeholders = str_repeat('?,', count($idArray) - 1) . '?';
        $sql = "SELECT id, name, description, efficacy_type, eff_value1, eff_value2, eff_value3 
                FROM enemy_skills 
                WHERE id IN ($placeholders)
                ORDER BY name ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($idArray);
        $skills = $stmt->fetchAll();
        
        echo json_encode(['skills' => $skills]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur de base de données: ' . $e->getMessage()]);
    }
}

function getAllSkills() {
    global $pdo;
    
    $limit = min(100, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = max(0, (int)($_GET['offset'] ?? 0));
    
    try {
        $sql = "SELECT id, name, description, efficacy_type, eff_value1, eff_value2, eff_value3 
                FROM enemy_skills 
                ORDER BY name ASC 
                LIMIT :limit OFFSET :offset";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $skills = $stmt->fetchAll();
        
        echo json_encode(['skills' => $skills]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur de base de données: ' . $e->getMessage()]);
    }
}
?>