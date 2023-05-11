<?php

require_once 'config.php';

session_start();

$cep = $_POST['cep'];

if ($cep) {
    $res = file_get_contents("http://viacep.com.br/ws/$cep/json");
    $data = json_decode($res);

    $stmt = $pdo->prepare("SELECT * FROM enderecos WHERE cep = :cep");
    $stmt->execute([':cep' => $cep]);

    if ($stmt->rowCount() == 0 && preg_match('/^[0-9]{5}-?[0-9]{3}$/', $cep)) {
        $stmt = $pdo->prepare("INSERT INTO enderecos VALUES (:cep, :rua, :bairro, :complemento, :cidade, :estado)");
        $stmt->execute([
            ':cep' => $cep,
            ':rua' => $data->logradouro,
            ':bairro' => $data->bairro,
            ':complemento' => $data->complemento,
            ':cidade' => $data->localidade,
            ':estado' => $data->uf
        ]);

        $_SESSION['message'] = "<div class='alert alert-success'>$cep adicionado!</div>";
    } else {
        if ($stmt->rowCount() != 0) {
            $_SESSION['message'] = "<div class='alert alert-warning'>CEP $cep já foi adicionado!</div>";
        }
        if (!preg_match('/^[0-9]{5}-?[0-9]{3}$/', $cep)) {
            $_SESSION['message'] = "<div class='alert alert-warning'>CEP inválido!</div>";
        }
    }
}

header("Location: index.php");
