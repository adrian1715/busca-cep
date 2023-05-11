<?php

require_once 'config.php';

session_start();

$id = $_POST['id'];

if (isset($id)) {
    $stmt = $pdo->prepare("DELETE FROM enderecos WHERE cep = :cep");
    $stmt->bindParam(":cep", $id);
    $stmt->execute();
}

header("Location: index.php");
