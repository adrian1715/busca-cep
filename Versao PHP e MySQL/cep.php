<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <?php

    $cep = @$_POST['cep'];
    $rua = @$_POST['rua'];
    $bairro = @$_PÒST['bairro'];
    $complemento = @$_POST['complemento'];
    $cidade = @$_POST['cidade'];
    $estado = @$_POST['estados'];

    echo $cep, $rua, $bairro, $complemento, $cidade, $estado;

    ?>
</body>

</html>