<?php
session_start();
if ($_SESSION['logged'] == 1){
    require_once 'views/public.html';
} else {
    header('Location: /');
}