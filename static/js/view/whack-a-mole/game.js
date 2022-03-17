/**
* @param x - Tamaño del grid en x
* @param y - Tamaño del grid en y
*/
let Game = class {
    constructor(x, y) {
        this.canvas = null;
        this.context = null;
        this.gradient = null;
        this.width = 0;
        this.height = 0;
        this.touch = new Point(0, 0);
        this.current = new Point(0, 0);
        this.start = new Point(0, 0);
        this.angle = 0;
        this.playing = false;
        this.step = 0;
        this.increment = 0;
        this.debug = false;
        this.timer = 0;
        // para el grid
        this.x = x;
        this.y = y;
        this.radius = 30;       // radio del circulo (px)
        this.lineWidth = 4;     // el ancho de la linea base (px)
        this.max = 0;
        this.index = 0;
        // inicializada al llamar el «play»
        this.velocity = 1000;   // velocidad: a mayor número más lento
        this.score = 0;         // puntos acumulados
        this.hit = 1;         // valor por acertar
        this.lastHit = -1;      // para que no se repita el hit sobre un mismo circulo
    }
    init() {
        this.canvas = document.getElementById('game');
        this.width = parseInt(this.canvas.width);
        this.height = parseInt(this.canvas.height);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.canvas.width;
        this.canvas.style.height = this.canvas.height;
        this.canvas.parentElement.style.display = 'block';
        this.context = this.canvas.getContext('2d');
        // donde comenzamos a dibujar
        this.start.x = (this.width - (this.x * this.radius)) / (this.x + 1.0);
        this.start.y = (this.height - (this.y * this.radius)) / (this.y + 1.0);
        // base
        this.drawBase();
    }
    isPlaying() {
        return this.playing;
    }
    play(velocity) {
        this.playing = true;
        this.velocity = velocity;
        this.score = 0;
        this.max = this.x * this.y;
        this.index = -1;
        this.lastHit = -1;
        this.nextPoint();
    }
    prepare() {
        // buscamos un punto a pintar que no sea el actual
        var i = -1;
        do {
            i = Math.floor(Math.random() * (this.max - 1)) + 1;
        } while (this.index == i);
        this.index = i;
        // calculamos desplazamiento del punto
        var x = this.index - (Math.floor(this.index / this.x) * this.x);
        if (x == 0) { x = this.x; }
        var y = Math.floor((this.index - 1) / this.x) + 1;
        this.current.x = ((this.start.x + this.radius) * x) - (this.radius / 2);
        this.current.y = ((this.start.y + this.radius) * y) - (this.radius / 2);
    }
    nextPoint() {
        // si se mantiene el juego programamos el siguiente punto
        if (this.playing) {
            this.prepare();
            // dejamos la indicación del siguiente punto
            var pointer = this;
            this.timer = setTimeout(function () {
                if (pointer.playing) {
                    pointer.nextPoint();
                }
            }, this.velocity);
        }
        this.clear();
        this.drawBase();
        this.drawPoint();
        this.drawDebug();
    }
    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = 0;
        }
    }
    stop(callback) {
        this.playing = false;
        this.clearTimer();
        this.nextPoint();
        callback(this.score);
    }
    drawDebug() {
        if (this.debug) {
            this.context.font = '14px Arial';
            this.context.fillStyle = '#FFFFFF';
            this.context.fillText('touch: ' + this.touch.toString(), 10, 20);
            this.context.fillText('actual: ' + this.current.toString(), 10, 40);
            this.context.fillText('indice: ' + this.index, 10, 60);
            this.context.fillText('max: ' + this.max, 10, 80);
            this.context.fillText('distancia: ' + this.getDistance(), 10, 100);
            this.context.fillText('velocidad: ' + this.velocity, 10, 120);
        }
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    drawPoint() {
        if (this.playing) {
            this.context.beginPath();
            this.context.arc(this.current.x, this.current.y, this.radius, 0, 2 * Math.PI, false);
            this.context.fillStyle = '#3CD5FC';
            this.context.fill();
        }
    }
    drawBase() {
        var grid = new Point(this.start.x + (this.radius / 2), this.start.y + (this.radius / 2));
        for (var j = 0; j < this.y; j++) {
            grid.x = this.start.x + (this.radius / 2);
            for (var i = 0; i < this.x; i++) {
                this.context.beginPath();
                this.context.arc(grid.x, grid.y, this.radius, 0, 2 * Math.PI, false);
                var gradient = this.context.createRadialGradient(grid.x - this.radius, grid.y, 0, grid.x - this.radius, grid.y, this.radius);
                gradient.addColorStop(0, '#333333');
                gradient.addColorStop(1, '#202020');
                this.context.fillStyle = gradient;
                this.context.fill();
                grid.x += this.start.x + this.radius;
            }
            grid.y += this.start.y + this.radius;
        }
    }
    click(x, y, callback) {
        if (this.playing) {
            this.touch.x = x;
            this.touch.y = y;
            // vemos si dio en el blanco
            var success = false;
            if (this.getDistance() <= this.radius && this.lastHit != this.index) {
                this.score += this.hit;
                this.lastHit = this.index;
                // le damos otro punto
                this.clearTimer();
                this.nextPoint();
                success = true;
            }
            callback(success, this.score);
        }
    }
    getDistance() {
        return Math.sqrt(Math.pow(this.current.x - this.touch.x, 2) + Math.pow(this.current.y - this.touch.y, 2));
    }
};
