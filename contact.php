<?php
// Load Composer's autoloader
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Retrieve SMTP credentials from environment variables
$smtpHost = $_ENV['SMTP_HOST'];
$smtpUser = $_ENV['SMTP_USER'];
$smtpPass = $_ENV['SMTP_PASS'];
$smtpPort = $_ENV['SMTP_PORT'];
$smtpSecure = $_ENV['SMTP_SECURE'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form data
    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r","\n"),array(" "," "),$name);
    
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    
    $phone = strip_tags(trim($_POST["phone"]));
    $message = strip_tags(trim($_POST["message"]));
    $referral = strip_tags(trim($_POST["referral"]));

    // Check required fields
    if ( empty($name) || empty($email) || empty($phone) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL) ) {
        // Invalid input
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = $smtpHost;               // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                    // Enable SMTP authentication
        $mail->Username   = $smtpUser;               // SMTP username
        $mail->Password   = $smtpPass;               // SMTP password
        $mail->SMTPSecure = $smtpSecure;             // Enable TLS encryption
        $mail->Port       = $smtpPort;               // TCP port to connect to

        // Recipients
        $mail->setFrom($smtpUser, 'First Divine Touch');
        $mail->addAddress('firstdivinetouch@gmail.com'); // Add a recipient

        // Content
        $mail->isHTML(false); // Set email format to plain text
        $mail->Subject = 'New Contact from First Divine Touch Website';
        $mail->Body    = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message\n";
        if (!empty($referral)) {
            $mail->Body .= "Referral: $referral\n";
        }

        $mail->send();
        
        // Redirection to homepage after successful email send
        header("Location: index.html?status=success");
        exit;
    } catch (Exception $e) {
        // Failure
        // Log the error (do not display it to the user)
        error_log("Mailer Error: {$mail->ErrorInfo}", 3, 'errors.log');
        
        // Redirect to homepage with error status
        header("Location: index.html?status=error");
        exit;
    }

} else {
    // Not a POST request
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>