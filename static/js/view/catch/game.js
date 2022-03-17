let Game = class {
    constructor(radius, errorRate) {
        this.canvas = null;
        this.context = null;
        this.gradient = null;
        this.width = 0;
        this.height = 0;
        this.center = new Point(0, 0);
        this.current = new Point(0, 0);
        this.maxAngle = 0;
        this.angle = 0;
        this.playing = false;
        this.step = 0;
        this.increment = 0;
        this.debug = false;     // para mostrar info del juego
        this.radiusRate = 0;    // radio valido en el que puede caer el punto
        // inicialización manual
        this.lineWidth = 4;     // el ancho de la linea base (px)
        this.radius = radius;   // radio del circulo (px)
        this.errorRate = errorRate; // porcentaje de desviación con respecto al centro
        // inicializada al llamar el «play»
        this.velocity = 1000;   // velocidad: a mayor número más lento
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
        this.center = new Point(this.width / 2, this.height / 2);
        this.context = this.canvas.getContext('2d');
        // relleno base
        this.gradient = this.context.createRadialGradient(this.center.x - this.radius, this.center.y, 0, this.center.x - this.radius, this.center.y, this.radius);
        this.gradient.addColorStop(0, '#3CD5FC');
        this.gradient.addColorStop(1, '#1D9BF0');
        // angulo maximo (para prevenir calculos adicionales pero darle dinamismo al movimiento)
        this.maxAngle = Math.floor(this.toDegree(Math.asin(this.height / Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)))));
        // radio de contacto
        this.radiusRate = this.radius + this.getRadiusRate();
        // cirulo base
        this.drawBase();
    }
    isPlaying() {
        return this.playing;
    }
    play(velocity) {
        this.playing = true;
        this.velocity = velocity;
        this.prepare();
        this.nextPoint();
    }
    prepare() {
        // generamos un angulo aleatorio
        this.angle = this.getNextAngle();
        this.current = new Point(-this.radius, 0);
        // intervalos para cumplir con la velocidad
        var a = this.width + (this.radius * 2);
        var b = this.getB(a, this.angle);
        var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        // incrementos de x
        // -- el 40 es arbitriario, se puede calcular mejor si es que la animación presenta lag
        this.increment = (c / 40.0) * Math.sin(this.toRadian(90 - this.angle));
        // pasos para cumplir con la velocidad
        this.step = this.velocity / this.increment;
    }
    nextPoint() {
        // si se mantiene el juego programamos el siguiente punto
        if (this.playing) {
            this.current.x += this.increment;
            if (this.current.x > (this.width + this.radius)) {
                this.prepare();
            }
            var pointer = this;
            setTimeout(function () {
                if (pointer.playing) {
                    pointer.nextPoint();
                }
            }, this.step);
        }
        this.clear();
        this.current.y = this.center.y - this.getB(this.current.x - this.center.x, this.angle);
        this.drawPoint();
        this.drawDebug();
        this.drawBase();
    }
    stop(successCallback, failCallback) {
        this.playing = false;
        this.nextPoint();
        // revisamos si quedo en el centro
        // modo gamer
        // if (this.center.equals(this.current)) {
        // modo señora de las compras
        if (this.getDistance() <= this.getRadiusRate()) {
            successCallback();
        } else {
            failCallback();
        }
    }
    drawDebug() {
        if (this.debug) {
            this.context.font = '14px Arial';
            this.context.fillText('centro: ' + this.center.toString(), 0, 20);
            this.context.fillText('actual: ' + this.current.toString(), 0, 40);
            this.context.fillText('paso: ' + this.step, 0, 60);
            this.context.fillText('incremento: ' + this.increment, 0, 80);
            this.context.fillText('radio: ' + this.radius, 0, 100);
            this.context.fillText('radio secundario: ' + this.radiusRate, 0, 120);
            this.context.fillText('error: ' + this.errorRate + '%', 0, 140);
            this.context.fillText('distancia: ' + this.getDistance(), 0, 160);
            this.context.fillText('distancia valida: ' + this.getRadiusRate(), 0, 180);
            this.context.fillText('velocidad: ' + this.velocity, 0, 200);
            this.drawPath();
        }
    }
    // auxiliares
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    drawPath() {
        var b = this.getB(this.center.x, this.angle);
        this.context.beginPath();
        this.context.moveTo(0, this.center.y + b);
        this.context.lineTo(this.width, this.center.y - b);
        this.context.stroke();
    }
    drawPoint() {
        this.context.beginPath();
        this.context.arc(this.current.x, this.current.y, this.radius, 0, 2 * Math.PI, false);
        // gradiente en el circulo
        // this.gradient = this.context.createRadialGradient(this.current.x - this.radius, this.current.y, 0, this.current.x - this.radius, this.current.y, this.radius);
        // this.gradient.addColorStop(0, '#3CD5FC');
        // this.gradient.addColorStop(1, '#1D9BF0');
        this.context.fillStyle = this.gradient;
        this.context.fill();
    }
    drawBase() {
        this.context.beginPath();
        this.context.arc(this.center.x, this.center.y, this.radiusRate, 0, 2 * Math.PI, false);
        this.context.lineWidth = this.lineWidth;
        this.context.strokeStyle = '#333333';
        this.context.stroke();
    }
    getB(a, alpha) {
        return (a * Math.sin(this.toRadian(alpha)) / Math.sin(this.toRadian(90 - alpha)));
    }
    getNextAngle() {
        return Math.floor(Math.random() * (this.maxAngle * 2)) - this.maxAngle;
    }
    toRadian(degree) {
        return degree * (Math.PI / 180);
    }
    toDegree(radian) {
        return radian * (180 / Math.PI);
    }
    getDistance() {
        return Math.sqrt(Math.pow(this.current.x - this.center.x, 2) + Math.pow(this.current.y - this.center.y, 2));
    }
    getRadiusRate() {
        return this.radius * this.errorRate / 100.0;
    }
};
