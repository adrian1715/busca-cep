<?php

require_once 'config.php';

session_start();

$id = $_POST['id'];

if (isset($id)) {
    $stmt = $pdo->prepare("DELETE FROM enderecos WHERE cep = :cep");
    $stmt->bindParam(":cep", $id);
    $stmt->execute();

    $_SESSION['message'] = "<div class='alert alert-danger'>CEP $id excluído!</div>";
}

header("Location: index.php");
