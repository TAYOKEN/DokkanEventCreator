<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $pdo = new PDO('sqlite:path/to/your/database.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $card_id = $_GET['card_id'] ?? '';
    
    if (empty($card_id)) {
        echo json_encode(['error' => 'Card ID is required']);
        exit;
    }
    
    $result = [];
    
    $stmt = $pdo->prepare("
        SELECT ccc.*, cc.name as category_name 
        FROM card_card_categories ccc 
        LEFT JOIN card_categories cc ON ccc.card_category_id = cc.id 
        WHERE ccc.card_id = ?
        ORDER BY ccc.num
    ");
    $stmt->execute([$card_id]);
    $result['categories'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $stmt = $pdo->prepare("
        SELECT cs.*, ss.* 
        FROM card_specials cs 
        LEFT JOIN special_sets ss ON cs.special_set_id = ss.id 
        WHERE cs.card_id = ?
        LIMIT 1
    ");
    $stmt->execute([$card_id]);
    $cardSpecial = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($cardSpecial) {
        $result['card_special'] = $cardSpecial;
        $result['special_set'] = [
            'id' => $cardSpecial['special_set_id'],
            'name' => $cardSpecial['name'],
            'description' => $cardSpecial['description'],
            'increase_rate' => $cardSpecial['increase_rate'],
            'lv_bonus' => $cardSpecial['lv_bonus']
        ];
        
        $stmt = $pdo->prepare("
            SELECT * 
            FROM specials 
            WHERE special_set_id = ?
            ORDER BY id
        ");
        $stmt->execute([$cardSpecial['special_set_id']]);
        $result['specials'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $result['card_special'] = null;
        $result['special_set'] = null;
        $result['specials'] = [];
    }
    
    echo json_encode($result);
    
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
}
?>