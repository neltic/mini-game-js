// inicializador de mini juego
var game = new Game(30, 75);
// numero de intentos
var attempt = 0
var userAttempt = 0;
// funciones auxiliares
function play() {
    // ocultamos o deshabilitamos el botón de jugar
    document.getElementById('play').disabled = true;
    document.getElementById('stop').style.display = '';
    document.getElementById('title').textContent = '¡A jugar!';
    // velocidad seleccionada
    var $vel = document.getElementsByName('velocity');
    var velocity;
    for (var i = 0; i < $vel.length; i++) {
        if ($vel[i].checked) {
            velocity = parseInt($vel[i].value);
        }
    }
    // se oculta para no cambiarla durante el juego
    toggleVelocity(false);

    // numero de intentos por velocidad
    if (attempt == 0) {
        userAttempt = 0;
        switch (velocity) {
            case 300:
                attempt = 3
                break;
            case 600:
                attempt = 2
                break;
            default:
                attempt = 1
                break;
        }
    }
    if (userAttempt < attempt) {
        userAttempt++;
        // iniciamos el juego
        game.play(velocity);
    } else {
        // ya no puede jugar
        document.getElementById('title').textContent = '¡Ya no tienes más intentos!';
        document.getElementById('play').style.display = 'none';
        document.getElementById('stop').style.display = 'none';
        document.getElementById('restart').style.display = 'block';
    }
};
function stop() {
    // ocultamos o deshabilitamos el botón de jugar
    document.getElementById('play').disabled = false;
    document.getElementById('stop').style.display = 'none';
    // detenemos el juego
    game.stop(function () {
        // dio en el centro
        document.getElementById('title').textContent = '¡Felicidades!';
    }, function () {
        // no lo logro
        document.getElementById('title').textContent = '¡Ops! No lograste atrapar el punto.';
    });
};
function playOrStop() {
    if (game.isPlaying())
        stop();
    else
        play();
};

function restart() {
    attempt = 0;
    toggleVelocity(true);
    document.getElementById('title').textContent = '¡A jugar!';
    document.getElementById('play').disabled = false;
    document.getElementById('play').style.display = 'block';
    document.getElementById('restart').style.display = 'none';
};

function toggleVelocity(state) {
    var radio = document.getElementsByName('velocity')
    var len = radio.length;
    for (var i = 0; i < len; i++) {
        radio[i].disabled = !state;
    }
};
// para detenerlo en el «enter»
document.addEventListener('keydown', function (event) {
    // barra espaciadora
    if (event.keyCode == 32) {
        if (game.isPlaying())
            stop();
        else
            play();
    }
});
