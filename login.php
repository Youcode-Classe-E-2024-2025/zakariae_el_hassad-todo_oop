<?php
include 'config/db.php';
include 'controllers/UserController.php';

$userController = new UserController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($userController->login($username, $password)) {
        echo "Login Successful!";
        header('Location: index.php');
        exit;
    } else {
        echo "Login Failed!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <link rel="stylesheet" href="./assets/css/style3.css">
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Login</h1>
            <form action="" method="post">
                <div class="input-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="input-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="signup.php">Sign Up</a></p>
            </form>
        </div>
    </div>
</body>
</html>
