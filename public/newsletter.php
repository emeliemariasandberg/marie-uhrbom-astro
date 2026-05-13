<?php
// Newsletter signup handler for Marie Uhrbom website
// Deploy alongside form.php on Strato hosting.

define('RECIPIENT_EMAIL', 'marie@marieuhrbom.se');
define('ALLOWED_ORIGIN',  'https://marieuhrbom.se');

// CSV stored one level above web root so it is not publicly accessible.
// On Strato shared hosting the web root is typically /html/ or /public_html/,
// so this resolves to the parent directory.
define('CSV_PATH', dirname(__DIR__) . '/newsletter_subscribers.csv');

header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Honeypot
if (!empty($_POST['_honey'])) {
    http_response_code(200);
    echo json_encode(['ok' => true]);
    exit;
}

$email    = trim($_POST['email']    ?? '');
$interest = trim(strip_tags($_POST['interest'] ?? ''));
$gdpr     = !empty($_POST['gdpr']);

if (!$email || !$gdpr) {
    http_response_code(400);
    echo json_encode(['error' => 'E-post och GDPR-samtycke krävs']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ogiltig e-postadress']);
    exit;
}

// Sanitise interest string — only allow known values
$allowed   = ['halsa', 'hantverk'];
$interests = array_filter(
    array_map('trim', explode(',', $interest)),
    fn($v) => in_array($v, $allowed, true)
);
$interestStr = implode(', ', $interests) ?: 'okänt';

// Append to CSV (creates file with header if it does not exist)
$csvExists = file_exists(CSV_PATH);
$fp = fopen(CSV_PATH, 'a');
if ($fp) {
    if (!$csvExists) {
        fputcsv($fp, ['timestamp', 'email', 'interest']);
    }
    fputcsv($fp, [date('Y-m-d H:i:s'), $email, $interestStr]);
    fclose($fp);
}

// Email notification to Marie
$mailSubject = '[Nyhetsbrev] Ny prenumerant — ' . $interestStr;
$mailBody    = "Ny prenumerant på marieuhrbom.se\n";
$mailBody   .= str_repeat('-', 40) . "\n\n";
$mailBody   .= "E-post:    $email\n";
$mailBody   .= "Intresse:  $interestStr\n";
$mailBody   .= "Datum:     " . date('Y-m-d H:i:s') . "\n\n";
$mailBody   .= str_repeat('-', 40) . "\n";
$mailBody   .= "GDPR-samtycke: Ja\n";
$mailBody   .= "Prenumeranter sparas i newsletter_subscribers.csv på servern.\n";

$headers  = "From: no-reply@marieuhrbom.se\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

mail(RECIPIENT_EMAIL, $mailSubject, $mailBody, $headers);

// Always return success to the visitor (even if email fails — CSV is the source of truth)
echo json_encode(['ok' => true]);
