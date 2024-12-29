<?php
class Task {
    private $conn;
    private $table = 'tasks';

    public $id;
    public $name;
    public $description;
    public $due_date;
    public $status;
    public $created_at;

    public function __construct() {
        require_once 'Database.php';
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Read all tasks
    public function read() {
        $query = 'SELECT * FROM ' . $this->table . ' ORDER BY created_at DESC';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Read single task
    public function read_single() {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->due_date = $row['due_date'];
            $this->status = $row['status'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }

    // Create task
    public function create() {
        $query = 'INSERT INTO ' . $this->table . ' 
            (name, description, due_date, status) 
            VALUES (:name, :description, :due_date, :status)';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->due_date = htmlspecialchars(strip_tags($this->due_date));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':due_date', $this->due_date);
        $stmt->bindParam(':status', $this->status);

        try {
            if ($stmt->execute()) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Create error: " . $e->getMessage());
            return false;
        }
    }

    // Update task
    public function update() {
        $query = 'UPDATE ' . $this->table . ' 
            SET name = :name, 
                description = :description, 
                due_date = :due_date, 
                status = :status
            WHERE id = :id';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->due_date = htmlspecialchars(strip_tags($this->due_date));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':due_date', $this->due_date);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':id', $this->id);

        try {
            if ($stmt->execute()) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Update error: " . $e->getMessage());
            return false;
        }
    }

    // Delete task
    public function delete() {
        $query = 'DELETE FROM ' . $this->table . ' WHERE id = :id';
        $stmt = $this->conn->prepare($query);

        // Clean id
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind id
        $stmt->bindParam(':id', $this->id);

        try {
            if ($stmt->execute()) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Delete error: " . $e->getMessage());
            return false;
        }
    }
}
?>
