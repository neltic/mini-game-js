// dimensión del grid x , y
var game = new Game(5, 5);
// tiempo que estara funcionando el juego (milisegundos)
var period = 10000;
// funciones auxiliares
function play() {
    // ocultamos o deshabilitamos los controles
    document.getElementById('play').disabled = true;
    document.getElementById('title').textContent = '¡A jugar!';    
    document.getElementById('score').textContent = '0';    
    // velocidad seleccionada
    var $vel = document.getElementsByName('velocity');
    var velocity;
    for (var i = 0; i < $vel.length; i++) {
        if ($vel[i].checked) {
            velocity = parseInt($vel[i].value);
            break;
        }
    }
    toggleVelocity(false);
    // iniciamos el juego
    game.play(velocity);
    // creamos el stop en base a lo configurado
    setTimeout(function () {
        stop();
    }, period);
}
function stop() {
    document.getElementById('play').disabled = false;
    toggleVelocity(true);
    // detenemos el juego
    game.stop(function (score) {
        if (score > 0) {
            document.getElementById('title').textContent = '¡Felicidades juntaste ' + score + ' puntos!';
        } else {
            document.getElementById('title').textContent = '¡Ops! No lograste ningún punto.';
        }
    });
};
function toggleVelocity(state) {
    var radio = document.getElementsByName('velocity')
    var len = radio.length;
    for (var i = 0; i < len; i++) {
        radio[i].disabled = !state;
    }
};
function onLoad() {
    game.init();
    // evento de click
    document.getElementById('game').addEventListener('click', function (e) {
        // trasladamos el movimiento a donde este el juego
        var offset = document.getElementById('game').getBoundingClientRect();
        // solicitamos la revisión del clic
        game.click(e.clientX - offset.left, e.clientY - offset.top, function (success, score) {
            if (success) {
                // si dio en el blanco actualizamos el score
                document.getElementById('score').textContent = score;
            }
        });
    });
};
