/**
* @param {int} x - Coordenada en x
* @param {int} y - Coordenada en y
*/
let Point = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return '(' + this.x + ',' + this.y + ')';
    }
    equals(point) {
        return Math.round(this.x) == Math.round(point.x) && Math.round(this.y) == Math.round(point.y);
    }
};
