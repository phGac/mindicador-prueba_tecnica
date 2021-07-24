<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historial UF</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
</head>

<body>
    <h1>Editar Historial UF</h1>

    <!--<div id="grid"></div>-->

    <form id="add-data">
        <div class="form-group row">
            <label for="date" class="col-4 col-form-label">Fecha</label>
            <div class="col-8">
                <input id="date" name="date" type="text" required="required" class="form-control datepicker" value="<?=$date?>" disabled>
            </div>
        </div>
        <div class="form-group row">
            <label for="value" class="col-4 col-form-label">Valor</label>
            <div class="col-8">
                <input id="value" name="value" type="text" class="form-control" required="required" value="<?=$value?>">
            </div>
        </div>
        <div class="form-group row">
            <div class="offset-4 col-8">
                <button name="submit" type="submit" class="btn btn-primary">Submit</button>
            </div>
        </div>
    </form>

    <script src="/js/maintainer.edit.js"></script>
</body>

</html>