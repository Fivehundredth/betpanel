<?php
require_once 'classes/db.php';
require_once 'classes/Event.php';
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
                $event = new Event();
                $event->setName($_POST['name']);
                $id = $event->save();
                if ($id){
                    echo json_encode(['success'=>$id]);
                    exit;
                }
            } catch (Exception $e){
                echo json_encode(['error'=>$e->getMessage()]);
                exit;
            }
            break;
        case 'contract':
            try{
                $db = db::getInstance();
                $query = $db->prepare('UPDATE `events` SET `contract`=:contract WHERE `id`=:id');
                $query->bindParam(':contract', $_POST['address']);
                $query->bindParam(':id', $_POST['event']);
                if ($query->execute()){
                    echo json_encode(['success'=>1]);
                    exit;
                }
            } catch (PDOException $e){
                echo json_encode(['error'=>$e->getMessage()]);
                exit;
            }
            break;
        case 'delete':
            $id = $_POST['id'];
            $event = Event::find($id);
            if ($event){
                if ($event->delete()){
                    echo json_encode(['success'=>$id]);
                    exit;
                } else {
                    echo json_encode(['error'=>'can not delete']);
                    exit;
                }
            } else {
                echo json_encode(['error'=>'can not find event']);
                exit;
            }
            break;
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
        case 'get-event':
            try{
                $db = db::getInstance();
                $query = $db->prepare('SELECT * FROM `events` WHERE `id`=:event_id');
                $query->bindParam(':event_id', $_GET['event_id']);
                $query->execute();
                $event = $query->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($event[0]);
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