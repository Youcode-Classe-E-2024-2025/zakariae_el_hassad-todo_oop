<?php
include __DIR__. '/../config/db.php';

class UserController {
    // Register a new user
    public function register($username, $email, $password) {
        global $conn;
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sss', $username, $email, $hashedPassword);
        return $stmt->execute();
    }

    // Login a user
    public function login($username, $password) {
        global $conn;
        $sql = "SELECT * FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                session_start();
                $_SESSION['username'] = $username;
                return true;
            }
        }
        return false;
    }

    // Logout a user
    public function logout() {
        session_start();
        session_unset();
        session_destroy();
    }

    // Validate user input
    public function validateInput($data) {
        return htmlspecialchars(stripslashes(trim($data)));
    }
}
?>