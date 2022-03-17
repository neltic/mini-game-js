var game = null;
var data = [];
// funciones auxiliares
function onLoad() {
    getData(true, function (result) {
        data = result;
        game = new Game(data);
        game.init();
    });
};
function getData(reset, callback) {
    $.ajax({
        type: 'POST',
        url: '/handler/GetData.ashx',
        data: { winner: -1, reset: reset }, // forzamos reset para el demo
        success: function (result) {
            callback(result);
        },
        dataType: 'json'
    });
}
function play() {
    getData(false, function (result) {
        data = result;
        if (data.length > 0) {
            // ocultamos o deshabilitamos el botón de jugar
            document.getElementById('play').disabled = true;
            document.getElementById('stop').style.display = '';
            // que comience a girar
            game.play(data);
        } else {
            checkGameplay();
        }

        // TODO: para detenerlo de manera automatica
        // HACK: Si se detiene de forma automatica se deben ocultar todas las referencias
        //       al botón de "stop" o causara comportamientos inesperados
        // setTimeout(stop, 2000);
    });
}
function stop() {
    // ocultamos o deshabilitamos el botón de jugar
    document.getElementById('play').disabled = false;
    document.getElementById('stop').style.display = 'none';
    // detenemos el juego
    game.stop(function (index, winner) {
        document.getElementById('winner').innerHTML = '¡Felicidades ' + winner.name + ', marcar al ' + winner.phone + '!';
        // TODO: guardar los cambios de los datos en "base de datos"
        //var i = 0;
        //do {
        //    if (data[i].name == winner.name) {
        //        data.splice(i, 1);
        //    }
        //    i++;
        //} while (i < data.length);
        checkGameplay();
        // sincronizamos al ganador
        setServerWinner(index);
    });
}
function checkGameplay() {
    // ya no hay datos a mandar a la ruleta
    if (data.length == 0) {
        document.getElementById('play').disabled = true;
        document.getElementById('stop').disabled = true;
    }
}
function playOrStop() {
    if (game.isPlaying())
        stop();
    else
        play();
}
function setServerWinner(index) {
    $.ajax({
        type: 'POST',
        url: '/handler/SetWinner.ashx',
        data: { winner: index },
        success: function (result) {
            // En caso de que se requiera hacer algo
            console.log(JSON.stringify(result));
        },
        dataType: 'json'
    });
}
