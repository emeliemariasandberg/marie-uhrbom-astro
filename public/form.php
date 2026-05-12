<?php
// Contact form handler for Marie Uhrbom website
// Deploy this file to Strato hosting at the same domain root.
// Configure RECIPIENT_EMAIL below with Marie's actual email address.

define('RECIPIENT_EMAIL', 'marie@marieuhrbom.se');
define('ALLOWED_ORIGIN', 'https://marieuhrbom.se');

header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Honeypot check
if (!empty($_POST['_honey'])) {
    http_response_code(200); // Pretend success to bots
    echo json_encode(['ok' => true]);
    exit;
}

// Validate required fields
$name    = trim(strip_tags($_POST['name'] ?? ''));
$email   = trim($_POST['email'] ?? '');
$subject = trim(strip_tags($_POST['subject'] ?? 'Förfrågan'));
$message = trim(strip_tags($_POST['message'] ?? ''));
$area    = trim(strip_tags($_POST['area'] ?? 'general'));
$gdpr    = !empty($_POST['gdpr']);

if (!$name || !$email || !$message || !$gdpr) {
    http_response_code(400);
    echo json_encode(['error' => 'Fält saknas']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ogiltig e-postadress']);
    exit;
}

// Build email
$areaLabel = match ($area) {
    'hantverk'  => 'Läderhantverk',
    'homeopati' => 'Homeopati',
    'coachning' => 'Hälsa & Livscoachning',
    default     => 'Allmän förfrågan',
};

$mailSubject = "[$areaLabel] $subject";

$mailBody = "Ny förfrågan via marieuhrbom.se\n";
$mailBody .= str_repeat('-', 40) . "\n\n";
$mailBody .= "Område:    $areaLabel\n";
$mailBody .= "Namn:      $name\n";
$mailBody .= "E-post:    $email\n";
$mailBody .= "Ämne:      $subject\n\n";
$mailBody .= "Meddelande:\n$message\n\n";
$mailBody .= str_repeat('-', 40) . "\n";
$mailBody .= "GDPR-samtycke: Ja\n";
$mailBody .= "Skickat: " . date('Y-m-d H:i:s') . "\n";

$headers  = "From: no-reply@marieuhrbom.se\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail(RECIPIENT_EMAIL, $mailSubject, $mailBody, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Kunde inte skicka e-post']);
}
