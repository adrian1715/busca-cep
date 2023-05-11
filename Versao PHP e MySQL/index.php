<?php

require_once 'config.php';
session_start();

// REGISTRAR CEP
if (isset($_POST['cep'])) {
  $cep = $_POST['cep'];
  $rua = $_POST['rua'];
  $bairro = $_POST['bairro'];
  $complemento = $_POST['complemento'];
  $cidade = $_POST['cidade'];
  $estado = $_POST['estados'];

  $query = "SELECT * FROM enderecos WHERE cep = :cep";
  $stmt = $pdo->prepare($query);
  $stmt->execute([':cep' => $cep]);

  if (preg_match('/^[0-9]{5}-?[0-9]{3}$/', $cep) && $stmt->rowCount() == 0) {
    $stmt = $pdo->prepare('INSERT INTO enderecos (cep, rua, bairro, complemento, cidade, estado) VALUES (:cep, :rua, :bairro, :complemento, :cidade, :estado)');
    $stmt->bindParam(':cep', $cep);
    $stmt->bindParam(':rua', $rua);
    $stmt->bindParam(':bairro', $bairro);
    $stmt->bindParam(':complemento', $complemento);
    $stmt->bindParam(':cidade', $cidade);
    $stmt->bindParam(':estado', $estado);
    $stmt->execute();

    // header("Location: index.php");
    $_SESSION['message'] = "<div class='alert alert-success'>$cep cadastrado!</div>";
  } else {
    // header("Location: index.php");
    $_SESSION['message'] = "<div class='alert alert-warning'>Dados inválidos!</div>";
  }
}

// EXIBE CEP's REGISTRADOS
$query = "SELECT * FROM enderecos";
$stmt = $pdo->prepare($query);
$stmt->execute();
$enderecos = $stmt->fetchAll();

// EXCLUIR REGISTRO
$target = @$_POST['id'];
if (isset($target)) {
  $stmt = $pdo->prepare('DELETE FROM enderecos WHERE cep = :target');
  $stmt->bindParam(':target', $target);
  $stmt->execute();

  // $_SESSION['message'] = "<div class='alert alert-danger'>$target excluído!</div>";
  header("Location: index.php");
}

?>



<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous" />

  <title>Requisição de CEP Ajax</title>

  <style></style>
</head>

<body class="container">

  <h1 class="mt-3 mb-4 text-center">Requisição AJAX</h1>
  <div class="card mb-4 point">
    <div class="card-header">
      <h2>Cadastrar</h2>
    </div>
    <form id="cadastro" action="" method="POST" class="card-body">
      <div class="row justify-content-center">
        <div class="col-4 form-group">
          <span>CEP</span>
          <input type="text" id="cep" name="cep" placeholder="CEP" class="form-control" required />
        </div>

        <div class="col-4 form-group">
          <span>Rua</span>
          <input type="text" id="rua" name="rua" placeholder="Rua" class="form-control" required />
        </div>
        <div class="col-4 form-group">
          <span>Bairro</span>
          <input type="text" id="bairro" name="bairro" placeholder="Bairro" class="form-control" required />
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-5 form-group">
          <span>Complemento</span>
          <input type="text" id="complemento" name="complemento" placeholder="Complemento" class="form-control" />
        </div>
        <div class="col-4 form-group">
          Cidade
          <input type="text" id="cidade" name="cidade" placeholder="Cidade" class="form-control" required />
        </div>
        <div class="col-3 form-group">
          Estado
          <select name="estados" id="estados" class="form-control" required>
            <option selected="selected" hidden disabled>Estado</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
        </div>
      </div>

      <button type="submit" value="submit" id="btn-cadastrar" class="btn btn-outline-primary mr-2">
        Cadastrar endereço</button><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" id="loading-icon" class="bi bi-hourglass" viewBox="0 0 16 16" style="display: none">
        <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2h-7z" />
      </svg>
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
                <form action="" method="POST" class="d-inline-block m-0">
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