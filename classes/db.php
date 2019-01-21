<?php

require_once(__DIR__ . '/../db_config.php');

class db
{
    private static $instance = NULL;

    private function __construct() {}

    private function __clone() {}

    public static function getInstance() {
        if (!isset(self::$instance)) {
            try{
            $pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
			self::$instance = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=UTF8', DB_USER, DB_PASSWORD, $pdo_options);
            }
            catch (\PDOException $e)
            {
                throw new PDOException($e->getMessage());
            }
        }
        return self::$instance;
    }
}