<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
session_start();
ini_set('display_errors', '0');
ini_set('log_errors', '1');

register_shutdown_function(function (): void {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        http_response_code(500);
        if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
        }
        echo json_encode([
                'error' => 'Internal server error',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
});

function json_response(array $payload, int $status = 200): never {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function db(): PDO {
    if (!in_array('mysql', PDO::getAvailableDrivers(), true)) {
        json_response(['error' => 'PDO MySQL n\'est pas disponible sur ce serveur PHP.'], 500);
    }

    $host = getenv('MYSQL_HOST') ?: '127.0.0.1';
    $port = getenv('MYSQL_PORT') ?: '3306';
    $database = getenv('MYSQL_DATABASE') ?: 'quizweb';
    $username = getenv('MYSQL_USER') ?: 'root';
    $password = getenv('MYSQL_PASSWORD') ?: '';

    $admin = new PDO("mysql:host=$host;port=$port;charset=utf8mb4", $username, $password);
    $admin->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $admin->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('CREATE TABLE IF NOT EXISTS questions (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        topic VARCHAR(20) NOT NULL,
        type VARCHAR(20) NOT NULL,
        question VARCHAR(500) NOT NULL,
        options TEXT NOT NULL,
        answer TINYINT UNSIGNED NOT NULL,
        explanation TEXT NULL
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS scores (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(40) NOT NULL,
        points INT UNSIGNED NOT NULL,
        correct_count INT UNSIGNED NOT NULL,
        total_count INT UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL
    )');
    return $pdo;
}

try {
    $pdo = db();
} catch (Throwable $e) {
    json_response(['error' => 'Internal server error'], 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$input = $method === 'POST'
    ? json_decode(file_get_contents('php://input'), true)
    : [];
if (!is_array($input)) $input = [];
$action = $input['action'] ?? ($_GET['action'] ?? 'load');

if ($action === 'load') {
    $topics = isset($_GET['topics']) ? explode(',', (string) $_GET['topics']) : null;
    $sql = 'SELECT id, topic, type, question, options, answer, explanation FROM questions';
    $params = [];
    if (is_array($topics) && $topics) {
        $placeholders = implode(',', array_fill(0, count($topics), '?'));
        $sql .= " WHERE topic IN ($placeholders)";
        $params = $topics;
    }
    $stmt = $pdo->prepare($sql . ' ORDER BY id');
    $stmt->execute($params);
    $questions = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $questions[] = [
            'id' => (int) $row['id'],
            'topic' => $row['topic'],
            'type' => $row['type'],
            'q' => $row['question'],
            'options' => json_decode($row['options'], true) ?: [],
            'answer' => (int) $row['answer'],
            'explain' => $row['explanation'],
        ];
    }
    $scores = $pdo->query('SELECT username, points, correct_count AS correct, total_count AS total, created_at AS date FROM scores ORDER BY points DESC, id ASC LIMIT 5')
        ->fetchAll(PDO::FETCH_ASSOC);
    json_response(['questions' => $questions, 'scores' => $scores]);
}

if ($action === 'add') {
    $topic = (string) ($input['topic'] ?? '');
    $type = ($input['type'] ?? '') === 'truefalse' ? 'truefalse' : 'qcm';
    $question = trim((string) ($input['q'] ?? ''));
    $options = is_array($input['options'] ?? null) ? array_values($input['options']) : [];
    $answer = filter_var($input['answer'] ?? null, FILTER_VALIDATE_INT);

    if (!in_array($topic, ['html', 'css', 'js'], true) || strlen($question) < 3) {
        json_response(['error' => 'Question ou theme invalide.'], 422);
    }
    if ($type === 'truefalse') {
        $options = ['Vrai', 'Faux'];
        $answer = in_array((int) $answer, [0, 1], true) ? (int) $answer : 0;
    } else {
        $options = array_values(array_filter(array_map(fn($value) => trim((string) $value), $options), fn($value) => $value !== ''));
        if (count($options) < 2 || $answer === false || $answer < 0 || $answer >= count($options)) {
            json_response(['error' => 'Reponses invalides.'], 422);
        }
    }

    $stmt = $pdo->prepare('INSERT INTO questions (topic, type, question, options, answer, explanation) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$topic, $type, $question, json_encode($options, JSON_UNESCAPED_UNICODE), (int) $answer, trim((string) ($input['explain'] ?? ''))]);
    json_response(['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
}

if ($action === 'delete') {
    $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
    if ($id === false) json_response(['error' => 'Identifiant invalide.'], 422);
    $pdo->prepare('DELETE FROM questions WHERE id = ?')->execute([(int) $id]);
    json_response(['ok' => true]);
}

if ($action === 'start') {
    $_SESSION['quiz_score'] = 0;
    $_SESSION['quiz_correct'] = 0;
    $_SESSION['quiz_total'] = 0;
    $_SESSION['quiz_finished'] = false;
    json_response(['ok' => true]);
}

if ($action === 'answer') {
    $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
    $timeout = ($input['reason'] ?? '') === 'timeout';
    $selected = $timeout
        ? null
        : filter_var($input['selected'] ?? null, FILTER_VALIDATE_INT);
    $elapsed = filter_var($input['elapsed'] ?? 0, FILTER_VALIDATE_FLOAT);
    if ($id === false) json_response(['error' => 'Reponse invalide.'], 422);
    if (!$timeout && $selected === false) json_response(['error' => 'Reponse invalide.'], 422);

    $stmt = $pdo->prepare('SELECT question, options, answer, explanation FROM questions WHERE id = ?');
    $stmt->execute([(int) $id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) json_response(['error' => 'Question introuvable.'], 404);

    $options = json_decode($row['options'], true);
    $selected = $timeout ? null : (int) $selected;
    $correctAnswer = (int) $row['answer'];
    $correct = !$timeout && $selected === $correctAnswer;
    $elapsedSeconds = max(0, min(20, is_numeric($elapsed) ? (int) floor((float) $elapsed / 1000) : 20));
    $points = $correct ? max(30, 100 - $elapsedSeconds * 3) : 0;

    $_SESSION['quiz_score'] = (int) ($_SESSION['quiz_score'] ?? 0) + $points;
    $_SESSION['quiz_correct'] = (int) ($_SESSION['quiz_correct'] ?? 0) + ($correct ? 1 : 0);
    $_SESSION['quiz_total'] = (int) ($_SESSION['quiz_total'] ?? 0) + 1;

    json_response([
        'correct' => $correct,
        'points' => $points,
        'score' => (int) $_SESSION['quiz_score'],
        'correctAnswer' => $correctAnswer,
        'solution' => $options[$correctAnswer] ?? '',
        'explanation' => $row['explanation'],
    ]);
}

if ($action === 'finish') {
    $username = trim((string) ($input['username'] ?? ''));
    $username = $username !== '' ? $username : 'Anonyme';
    $username = function_exists('mb_substr') ? mb_substr($username, 0, 40) : substr($username, 0, 40);
    $points = (int) ($_SESSION['quiz_score'] ?? 0);
    $correct = (int) ($_SESSION['quiz_correct'] ?? 0);
    $sessionTotal = (int) ($_SESSION['quiz_total'] ?? 0);
    $total = filter_var($input['total'] ?? $sessionTotal, FILTER_VALIDATE_INT);
    $total = $total === false ? $sessionTotal : max(0, (int) $total);

    $sentPoints = filter_var($input['points'] ?? null, FILTER_VALIDATE_INT);
    $sentCorrect = filter_var($input['correct'] ?? null, FILTER_VALIDATE_INT);
    if ($sessionTotal === 0) {
        if ($sentPoints !== false) $points = max(0, (int) $sentPoints);
        if ($sentCorrect !== false) $correct = max(0, (int) $sentCorrect);
    }

    if (!isset($_SESSION['quiz_finished']) || $_SESSION['quiz_finished'] !== true) {
        $stmt = $pdo->prepare('INSERT INTO scores (username, points, correct_count, total_count, created_at) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$username, $points, $correct, $total, date('Y-m-d H:i:s')]);
        $_SESSION['quiz_finished'] = true;
    }
    $scores = $pdo->query('SELECT username, points, correct_count AS correct, total_count AS total, created_at AS date FROM scores ORDER BY points DESC, id ASC LIMIT 5')
        ->fetchAll(PDO::FETCH_ASSOC);
    json_response(['points' => $points, 'correct' => $correct, 'total' => $total, 'scores' => $scores]);
}

json_response(['error' => 'Action inconnue.'], 400);
