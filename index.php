<?php
require_once 'classes/db.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    switch ($_POST['action']){
        case 'login':
            if ($_POST['username'] == 'admin' && $_POST['password'] == 'admin'){
                $_SESSION['logged'] = 1;
            }
            break;
        case 'create-event':
            try {
                $db = db::getInstance();
                $query = $db->prepare('INSERT INTO `events` VALUES (null, :name)');
                $query->bindParam(':name', $_POST['name']);
                $query->execute();
                $r = $db->lastInsertId();
                if ($r){
                    echo json_encode(['success' => $r]);
                    exit;
                }
            } catch (PDOException $e){
                echo json_encode(['error'=>$e->getMessage()]);
                exit;
            }
    }
}
if ($_SERVER['REQUEST_METHOD'] == 'GET'){
    switch ($_GET['action']){
        case 'get-events':
            try{
                $db = db::getInstance();
                $query = $db->prepare('SELECT * FROM `events`');
                $query->execute();
                $r = $query->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($r);
                exit;
            } catch (PDOException $e){
                echo json_encode(['error'=>$e->getMessage()]);
                exit;
            }
            break;
    }
}
if ($_SESSION['logged'] == 1){
    require_once 'views/index.html';
} else {
    require_once 'views/login.html';
}