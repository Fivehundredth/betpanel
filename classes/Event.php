<?php
require_once ('db.php');

class Event
{
    protected $id;
    protected $name;
    protected $contract = null;
    protected $txn_hash = null;

    public function setName($name){
        $this->name = $name;
    }
    public static function find($id)
    {
        try {
            $db = db::getInstance();
            $query = $db->prepare('SELECT * FROM `events` WHERE `id`=:id');
            $query->bindParam(':id', $id);
            $query->execute();
            $query->setFetchMode(PDO::FETCH_CLASS, __CLASS__);
            $event = $query->fetch();
            if ($event){
                return $event;
            }
        } catch (PDOException $e){
            return false;
        }
    }
    public function save()
    {
        try {
            $db = db::getInstance();
            $query = $db->prepare('INSERT INTO `events` VALUES (null, :name, :contract, :hash)');
            $query->bindParam(':name', $this->name);
            $query->bindParam(':contract', $this->contract);
            $query->bindParam(':hash', $this->txn_hash);
            $query->execute();
            $id = $db->lastInsertId();
            return $id;
        } catch (PDOException $e){
            return false;
        }
    }

    public function update()
    {
        try {
            $db = db::getInstance();
            $query = $db->prepare('UPDATE `events` SET `contract`=:contract, `txn_hash`=:hash WHERE `id`=:id');
            $query->bindParam(':contract', $this->contract);
            $query->bindParam(':hash', $this->txn_hash);
            $query->bindParam(':id', $this->id);
            $query->execute();
            return true;
        } catch (PDOException $e){
            return false;
        }
    }
    public function delete()
    {
        try {
            $db = db::getInstance();
            $query = $db->prepare('DELETE FROM `events` WHERE `id`=:id');
            $query->bindParam(':id', $this->id);
            $query->execute();
            return true;
        } catch (PDOException $e){
            return false;
        }
    }
}