<?php
include 'config/db.php';
include 'controllers/UserController.php';

$userController = new UserController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password == $confirm_password) {
        if ($userController->register($username, $email, $password)) {
            echo "New record created successfully";
            header('Location: login.php');
            exit;
        } else {
            echo "Error: unable to create new record";
        }
    } else {
        echo "Passwords do not match";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Sign Up</title>
    <link rel="stylesheet" href="./assets/css/style3.css">
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Sign Up</h1>
            <form action="" method="post">
                <div class="input-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="input-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="input-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="input-group">
                    <label for="confirm_password">Confirm Password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" required>
                </div>
                <button type="submit">Sign Up</button>
                <p>I have an account? <a href="login.php">login</a></p>
            </form>
        </div>
    </div>
</body>
</html>
