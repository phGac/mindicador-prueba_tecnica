<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/gijgo@1.9.13/js/gijgo.min.js" type="text/javascript"></script>
    <link href="https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="/css/base.css" />
    <title>Indicadores Económicos</title>
</head>

<body>
    <button class="btn" onclick="(() => window.location.href = '/historicos')()">Mantenedor de UF</button>

    <form class="form-compare-indicators">
        <div class="row">
            <div class="col">
                <div class="form-group py-sm-3 mb-0">
                    <label for="type" class="col-sm-4">Tipo de Indicador</label> 
                    <div class="col-sm-12">
                        <select id="type" name="type" required="required" class="custom-select">
                            <option value="">-</option>
                        </select>
                    </div>
                </div>
                <div class="input-group input-daterange col-sm-12">
                    <input id="date-from" type="text" class="form-control datepicker" width="44%">
                    <div class="input-group-prepend">
                        <span class="input-group-text">hasta</span>
                    </div>
                    <input id="date-to" type="text" class="form-control datepicker" width="44%">
                    <span class="error-range hidden">* Rango de fecha incorrecto</span>
                </div>
            </div>
            <div class="col">
                <div class="form-group py-sm-3 mb-0">
                    <label for="graphic_type" class="col-sm-4">Tipo de Gráfico</label> 
                    <div class="col-sm-12">
                        <select id="graphic_type" name="type" required="required" class="custom-select">
                            <option value="line">Lineas</option>
                            <option value="bar">Barras</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-group py-sm-3 mb-0 col-sm-12 hidden">
            <label>Comparar por Unidad de Medida</label>
            <div id="compare-list"></div>
        </div>
    </form>

    <canvas id="chart" width="300" height="100"></canvas>
    <script src="/js/home.js"></script>
</body>

</html>