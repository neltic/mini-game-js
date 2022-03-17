let WorkArea = class {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    toString() {
        return '(' + this.x + ',' + this.y + '->' + this.width + ',' + this.height + ')';
    }
};
let Game = class {
    constructor(data) {
        this.canvas = null;
        this.context = null;
        this.gradient = null;
        this.width = 0;
        this.height = 0;
        this.center = new Point(0, 0);
        this.current = new Point(0, 0);
        this.playing = false;
        this.drawing = false;
        this.step = 10;
        this.increment = 0;
        this.debug = false;
        this.bodyArea = new WorkArea(0, 0, 0, 0); // para el area del body
        this.mainArea = new WorkArea(0, 0, 0, 0); // para el area de trabajo real
        this.sectionHeight = 0; // el alto de los bloques
        // inicialización manual
        this.lineWidth = 2;         // el ancho de la linea base (px)
        this.blockLineWidth = 4;    // el ancho de la linea del bloque (px)
        this.triangleBase = 30;     // base del triangulo (px)
        this.sectionCount = 16;     // bloques con los nombres que aparecen en la vista
        this.triangleCount = 9;     // bloque donde se coloca el triangulo seleccionador
        this.blockColor = ['#D8F7FE', '#C9E8FC'];
        this.bodyColor = '#000000';
        // datos del carrusel
        this.data = data;
        this.currentIndex = 0;
        this.colorIndex = 0;
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
        this.bodyArea = new WorkArea(this.lineWidth + this.triangleBase / 3, this.lineWidth, this.width - this.triangleBase / 3 - this.lineWidth * 2, this.height - this.lineWidth * 2);
        this.mainArea = new WorkArea(this.bodyArea.x + this.triangleBase / 3, this.bodyArea.y + this.triangleBase * 2 / 3, this.bodyArea.width - this.triangleBase, this.bodyArea.height - this.triangleBase * 4 / 3);
        this.sectionHeight = Math.floor(this.mainArea.height / this.sectionCount);
        // pintado inicial
        this.drawBase();
        this.drawData();        
        // debug
        this.drawDebug();
    }
    isPlaying() {
        return this.playing;
    }
    play(data) {
        this.data = data;
        this.playing = true;
        this.prepare();
        this.next();
    }
    prepare() {
        this.currentIndex = 0;
        this.colorIndex = 0;
        // vamos a pasar la sección en n partes
        this.increment = this.sectionHeight / 3; // si se divide por la unidad se acelera
    }
    next() {
        // si se mantiene el juego que siga moviendose la ruleta
        if (this.playing) {
            this.current.y += this.increment;
            if (this.current.y > this.sectionHeight) {
                this.current.y = 0;
                // cambiamos el indice
                this.currentIndex++;
                if (this.currentIndex >= this.data.length) {
                    this.currentIndex = 0;
                    this.colorIndex++;
                    if (this.colorIndex >= this.blockColor.length) {
                        this.colorIndex = 0;
                    }
                }
            }
            var pointer = this;
            setTimeout(function () {
                if (pointer.playing && !pointer.drawing) {
                    pointer.next();
                }
            }, this.step);
        }
        this.clear();
        this.drawBase();
        this.drawData();
        this.drawTriangle();
        this.drawDebug();
    }
    stop(winnerCallback) {
        this.playing = false;
        // calculamos el ganador
        var winner = this.currentIndex + this.triangleCount - 1;
        // si el ganador sobrepasa la lista hacemos el ajuste
        while (winner >= this.data.length) {
            winner = winner - this.data.length;
        }
        // reseteamos cordenadas para centrar al ganador
        this.current.y = 0;
        // repintamos
        this.next();
        // regresamos el indice ganador y el registro completo
        winnerCallback(winner, this.data[winner]);
    }
    setWinner(winner, winnerCallback) {
        this.currentIndex = winner - this.triangleCount + 1;
        while (this.currentIndex < 0) {
            this.currentIndex += this.data.length;
        }
        this.stop(winnerCallback);
    }
    drawDebug() {
        if (this.debug) {
            console.log('centro: ' + this.center.toString());
            console.log('body (area): ' + this.bodyArea.toString());
            console.log('main (area): ' + this.mainArea.toString());
            console.log('section count: ' + this.sectionCount);
            console.log('section height: ' + this.sectionHeight);
        }
    }
    // auxiliares
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    drawBase() {
        // background
        //this.context.fillStyle = '#ffffff';
        //this.context.fillRect(this.bodyArea.x - this.lineWidth, this.bodyArea.y - this.lineWidth, this.bodyArea.width + this.lineWidth * 2, this.bodyArea.height + this.lineWidth * 2);
        this.context.fillStyle = this.bodyColor;
        this.context.fillRect(this.bodyArea.x, this.bodyArea.y, this.bodyArea.width, this.bodyArea.height);
    }
    drawData() {
        this.drawing = true;
        this.context.save();
        this.context.rect(this.mainArea.x, this.mainArea.y, this.mainArea.width, this.mainArea.height);
        this.context.clip();
        this.context.translate(this.mainArea.x, this.mainArea.y);
        var internalIndex = this.currentIndex;
        // pintamos virtualmente otro para cuando se "mueva"
        for (var i = 0; i < this.sectionCount + 1; i++) {
            this.context.fillStyle = this.blockColor[(this.colorIndex + i) % this.blockColor.length];
            this.context.fillRect(0, this.sectionHeight * i - this.current.y, this.mainArea.width, this.sectionHeight);
            this.context.rect(0, this.sectionHeight * i - this.current.y, this.mainArea.width, this.sectionHeight);
            this.context.lineWidth = this.blockLineWidth;
            this.context.strokeStyle = this.bodyColor;
            this.context.stroke();
            this.context.font = 'normal normal bold 12px Arial';
            this.context.fillStyle = '#000000';
            this.context.textAlign = 'center';
            this.context.fillText(this.data[internalIndex].name, this.mainArea.width / 2, this.sectionHeight * (i + 1) - 12 - this.current.y); // padding bottom
            internalIndex++;
            if (internalIndex >= this.data.length) {
                internalIndex = 0;
            }
        }
        this.context.restore();
        this.drawing = false;
    }
    drawTriangle() {
        this.context.save();
        this.context.translate(0, this.mainArea.y);
        var p = new Point(this.triangleBase, this.sectionHeight * (this.triangleCount - 1) + (this.sectionHeight / 2));
        this.context.beginPath();
        this.context.moveTo(p.x, p.y);
        this.context.lineTo(0, p.y - this.triangleBase / 2);
        this.context.lineTo(0, p.y + this.triangleBase / 2);
        this.context.fillStyle = '#1D9BF0';        
        this.context.fill();        
        this.context.closePath();
        this.context.restore();
    }
};
