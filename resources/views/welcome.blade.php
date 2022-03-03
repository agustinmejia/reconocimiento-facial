<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="{{ url('js/face-api/face-api.js') }}"></script>
    <style>
        body{
            margin: 0;
            padding: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        canvas{
            position: absolute;
        }
    </style>
</head>
<body>
    
    <video id="video" width="720" height="560" autoplay muted></video>

    <script src="{{ url('js/face-api/main.js') }}"></script>
</body>
</html>