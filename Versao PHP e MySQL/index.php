<?php

require_once 'config.php';
session_start();

$stmt = $pdo->prepare("SELECT * FROM enderecos");
$stmt->execute();

$enderecos = $stmt->fetchAll();

?>



<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous" />

  <title>Busca CEP</title>

  <style></style>
</head>

<body class="container">

  <h1 class="mt-3 mb-4 text-center">Busca CEP</h1>
  <div class="card mb-4 point">
    <div class="card-header">
      <h2>Cadastrar</h2>
    </div>
    <form id="cadastro" action="adicionar-cep.php" method="POST" class="card-body d-flex">
      <input type="text" class="form-control col-4" name="cep" placeholder="Insira o CEP">
      <button type="submit" value="submit" id="btn-cadastrar" class="btn btn-outline-primary ml-2">
        Cadastrar</button>
    </form>
  </div>

  <?php if (isset($_SESSION['message'])) {
    echo $_SESSION['message'];
    unset($_SESSION['message']);
  } ?>

  <div class="registros mt-4 point">
    <div class="card">
      <div class="card-header">
        <h2>Registros</h2>
      </div>
      <?php
      if (@$enderecos) { ?>
        <div class="card-body">
          <div id="bq-resultado" class="blockquote">
            <span>
              <?php
              foreach ($enderecos as $end) {
                if ($end['complemento']) {
                  echo "<b>{$end['cep']}:</b> {$end['rua']}, {$end['bairro']}, {$end['complemento']}, {$end['cidade']}-{$end['estado']}";
                } else {
                  echo "<b>{$end['cep']}:</b> {$end['rua']}, {$end['bairro']}, {$end['cidade']}-{$end['estado']}";
                } ?>
                <form action="excluir-cep.php" method="POST" class="d-inline-block m-0">
                  <?php
                  echo "<input type='hidden' name='id' value='{$end['cep']}'>";
                  echo "<button type='submit' class='btn btn-outline-danger ml-2 mb-1' style='padding: 2px 8px'>X</button>";
                  ?>
                </form>
            </span><br>
        <?php
              }
            }
        ?></form>
          </div>
        </div>

    </div>
  </div>


  <script>
    // para evitar form resubmssion
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.href);
    }
  </script>
  <script type="text/javascript" src="app.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct" crossorigin="anonymous"></script>
</body>

</html>