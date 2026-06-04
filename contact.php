<?php
/**
 * Contact Form Handler — Gowtham Kumar D Portfolio
 * Handles form submission, sends email, and stores in DB
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ── Config ──────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'portfolio_db');

define('OWNER_EMAIL', 'gowthamkumard6@gmail.com');
define('OWNER_NAME',  'Gowtham Kumar D');
define('SMTP_FROM',   'noreply@gowthamkumar.dev');

// ── Helpers ──────────────────────────────────────────────────
function sendJson(bool $success, string $message, array $extra = []): never {
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit;
}

function sanitize(string $input): string {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function validateEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ── Reject non-POST ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(false, 'Method not allowed.');
}

// ── Collect & validate inputs ────────────────────────────────
$name    = sanitize($_POST['name']    ?? '');
$email   = sanitize($_POST['email']   ?? '');
$subject = sanitize($_POST['subject'] ?? '');
$message = sanitize($_POST['message'] ?? '');

$errors = [];
if (empty($name) || strlen($name) < 2)        $errors[] = 'Name must be at least 2 characters.';
if (!validateEmail($email))                    $errors[] = 'Please enter a valid email address.';
if (empty($subject) || strlen($subject) < 3)  $errors[] = 'Subject must be at least 3 characters.';
if (empty($message) || strlen($message) < 10) $errors[] = 'Message must be at least 10 characters.';

// Basic rate limiting via session
session_start();
$now = time();
if (!isset($_SESSION['last_contact'])) $_SESSION['last_contact'] = 0;
if ($now - $_SESSION['last_contact'] < 60) {
    sendJson(false, 'Please wait a minute before sending another message.');
}

if (!empty($errors)) {
    sendJson(false, implode(' ', $errors), ['errors' => $errors]);
}

// ── Store in database ────────────────────────────────────────
$stored = false;
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
    $stmt = $pdo->prepare(
        "INSERT INTO contact_messages (name, email, subject, message, ip_address, created_at)
         VALUES (:name, :email, :subject, :message, :ip, NOW())"
    );
    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':subject' => $subject,
        ':message' => $message,
        ':ip'      => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0',
    ]);
    $stored = true;
} catch (PDOException $e) {
    // DB optional — log silently, don't block email
    error_log('Portfolio DB error: ' . $e->getMessage());
}

// ── Send email ───────────────────────────────────────────────
$emailSubject = "Portfolio Contact: {$subject}";

$htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #060b18; color: #f1f5f9; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; }
  .header h1 { margin: 0; font-size: 1.6rem; color: #fff; }
  .header p { margin: 6px 0 0; color: rgba(255,255,255,0.8); font-size: 0.9rem; }
  .body { padding: 30px; }
  .field { margin-bottom: 20px; }
  .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 6px; }
  .value { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px 16px; color: #f1f5f9; font-size: 0.95rem; }
  .message-box { white-space: pre-wrap; line-height: 1.7; }
  .footer { padding: 16px 30px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 0.78rem; color: #64748b; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>&lt;GK/&gt; New Portfolio Message</h1>
    <p>gowthamkumard6@gmail.com</p>
  </div>
  <div class="body">
    <div class="field"><div class="label">From</div><div class="value">{$name} &lt;{$email}&gt;</div></div>
    <div class="field"><div class="label">Subject</div><div class="value">{$subject}</div></div>
    <div class="field"><div class="label">Message</div><div class="value message-box">{$message}</div></div>
    <div class="field"><div class="label">Received</div><div class="value">" . date('d M Y, H:i:s T') . "</div></div>
  </div>
  <div class="footer">Sent from Gowtham Kumar D's Portfolio Website</div>
</div>
</body>
</html>
HTML;

$textBody = "New message from your portfolio:\n\nFrom: {$name} <{$email}>\nSubject: {$subject}\nMessage:\n{$message}\n\nReceived: " . date('d M Y, H:i:s') . "\n";

$headers  = "From: " . SMTP_FROM . "\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . PHP_VERSION . "\r\n";

$mailSent = @mail(OWNER_EMAIL, $emailSubject, $htmlBody, $headers);

// ── Auto-reply ───────────────────────────────────────────────
$replySubject = "Thanks for reaching out, {$name}!";
$replyBody    = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #060b18; color: #f1f5f9; margin: 0; padding: 20px; }
  .container { max-width: 560px; margin: 0 auto; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; }
  .header h1 { margin: 0; font-size: 1.4rem; color: #fff; }
  .body { padding: 30px; line-height: 1.8; color: #cbd5e1; }
  .body a { color: #60a5fa; }
  .footer { padding: 16px 30px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 0.78rem; color: #64748b; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><h1>Thanks, {$name}! ✨</h1></div>
  <div class="body">
    <p>I've received your message regarding <strong>{$subject}</strong>.</p>
    <p>I'll review it and get back to you as soon as possible — typically within 24-48 hours.</p>
    <p>In the meantime, feel free to connect with me:</p>
    <ul>
      <li>📧 <a href="mailto:gowthamkumard6@gmail.com">gowthamkumard6@gmail.com</a></li>
      <li>📍 Chennai, Tamil Nadu, India</li>
    </ul>
    <p>Best regards,<br><strong>Gowtham Kumar D</strong><br>Full Stack Developer</p>
  </div>
  <div class="footer">This is an automated reply. Please do not respond to this email.</div>
</div>
</body>
</html>
HTML;

$replyHeaders  = "From: " . OWNER_NAME . " <" . SMTP_FROM . ">\r\n";
$replyHeaders .= "MIME-Version: 1.0\r\n";
$replyHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
@mail($email, $replySubject, $replyBody, $replyHeaders);

// ── Update rate limit ─────────────────────────────────────────
$_SESSION['last_contact'] = $now;

// ── Respond ──────────────────────────────────────────────────
if ($mailSent || $stored) {
    sendJson(true, 'Message sent successfully! I\'ll get back to you soon.', ['stored' => $stored, 'emailed' => $mailSent]);
} else {
    sendJson(false, 'Could not send your message. Please email directly at gowthamkumard6@gmail.com');
}
