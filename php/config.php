<?php
$host = 'sql204.infinityfree.com';
$dbname = 'dokkan';
$username = 'USERNAME';
$password = 'PASS';
$port = 3306;

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    
    
} catch (PDOException $e) {
    error_log("Erreur de connexion à la base de données: " . $e->getMessage());
    
    if (isset($_SERVER['HTTP_HOST'])) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur de connexion à la base de données']);
    } else {
        echo "Erreur de connexion: " . $e->getMessage() . "\n";
    }
    exit;
}

date_default_timezone_set('Europe/Paris');

$GLOBALS['pdo'] = $pdo;
$GLOBALS['db_config'] = [
    'host' => $host,
    'dbname' => $dbname,
    'charset' => 'utf8mb4'
];
?>