<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../classes/Task.php';

class TaskController {
    private $task;

    public function __construct() {
        $this->task = new Task();
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        // Handle preflight request
        if ($method === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        error_log("Received {$method} request");
        
        switch($method) {
            case 'GET':
                if(isset($_GET['id'])) {
                    $this->getTask($_GET['id']);
                } else {
                    $this->getAllTasks();
                }
                break;
            case 'POST':
                $this->createTask();
                break;
            case 'PUT':
                $this->updateTask();
                break;
            case 'DELETE':
                $this->deleteTask();
                break;
            default:
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function getAllTasks() {
        $result = $this->task->read();
        $num = $result->rowCount();

        if($num > 0) {
            $tasks_arr = array();
            $tasks_arr['data'] = array();

            while($row = $result->fetch(PDO::FETCH_ASSOC)) {
                extract($row);

                $task_item = array(
                    'id' => $id,
                    'name' => $name,
                    'description' => $description,
                    'due_date' => $due_date,
                    'status' => $status,
                    'created_at' => $created_at
                );

                array_push($tasks_arr['data'], $task_item);
            }

            echo json_encode($tasks_arr);
        } else {
            echo json_encode(array('message' => 'No tasks found'));
        }
    }

    private function getTask($id) {
        $this->task->id = $id;

        if($this->task->read_single()) {
            $task_arr = array(
                'id' => $this->task->id,
                'name' => $this->task->name,
                'description' => $this->task->description,
                'due_date' => $this->task->due_date,
                'status' => $this->task->status,
                'created_at' => $this->task->created_at
            );

            echo json_encode($task_arr);
        } else {
            echo json_encode(array('message' => 'Task not found'));
        }
    }

    private function createTask() {
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));
        error_log("Received task data: " . json_encode($data)); // Debug log

        if(
            !empty($data->name) &&
            !empty($data->description) &&
            !empty($data->due_date) &&
            !empty($data->status)
        ) {
            $this->task->name = $data->name;
            $this->task->description = $data->description;
            $this->task->due_date = $data->due_date;
            $this->task->status = $data->status;

            try {
                if($this->task->create()) {
                    echo json_encode(array('message' => 'Task created'));
                } else {
                    echo json_encode(array('message' => 'Task creation failed'));
                }
            } catch (Exception $e) {
                error_log("Error creating task: " . $e->getMessage()); // Debug log
                echo json_encode(array('message' => 'Database error: ' . $e->getMessage()));
            }
        } else {
            $missing = array();
            if(empty($data->name)) $missing[] = 'name';
            if(empty($data->description)) $missing[] = 'description';
            if(empty($data->due_date)) $missing[] = 'due_date';
            if(empty($data->status)) $missing[] = 'status';
            
            echo json_encode(array(
                'message' => 'Missing required fields: ' . implode(', ', $missing)
            ));
        }
    }

    private function updateTask() {
        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->id) &&
            !empty($data->name) &&
            !empty($data->description) &&
            !empty($data->due_date) &&
            !empty($data->status)
        ) {
            $this->task->id = $data->id;
            $this->task->name = $data->name;
            $this->task->description = $data->description;
            $this->task->due_date = $data->due_date;
            $this->task->status = $data->status;

            try {
                if($this->task->update()) {
                    echo json_encode(array('message' => 'Task updated'));
                } else {
                    echo json_encode(array('message' => 'Task update failed'));
                }
            } catch (Exception $e) {
                error_log("Error updating task: " . $e->getMessage());
                echo json_encode(array('message' => 'Database error: ' . $e->getMessage()));
            }
        } else {
            echo json_encode(array('message' => 'Missing required fields'));
        }
    }

    private function deleteTask() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->id)) {
            $this->task->id = $data->id;

            try {
                if($this->task->delete()) {
                    echo json_encode(array('message' => 'Task deleted'));
                } else {
                    echo json_encode(array('message' => 'Task deletion failed'));
                }
            } catch (Exception $e) {
                error_log("Error deleting task: " . $e->getMessage());
                echo json_encode(array('message' => 'Database error: ' . $e->getMessage()));
            }
        } else {
            echo json_encode(array('message' => 'Missing task ID'));
        }
    }
}

// Create controller instance and handle request
$controller = new TaskController();
$controller->handleRequest();