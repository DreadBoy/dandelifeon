class Field {

    constructor(size) {
        this.data = [];
        for (let i = 0; i < size * size; i++)
            this.data[i] = 0;
        this.size = size;
    }

    getX(index) {
        return index % this.size;
    }

    getY(index) {
        return Math.floor(index / this.size);
    }

    getCell(x, y) {
        return this.data[x * this.size + y];
    }

    setCell(x, y, value) {
        this.data[x * this.size + y] = value;
    }
}


class Game {

    constructor(canvas, sizeOfCell) {
        this.height = canvas.height = 25 * sizeOfCell;
        this.width = canvas.width = 25 * sizeOfCell;
        this.ctx = canvas.getContext("2d");
        this.sizeOfCell = sizeOfCell;
    }

    step() {

    }

    draw(field) {
        const size = this.sizeOfCell;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'green';
        field.data.forEach((cell, index) => {
            if (cell === 1)
                this.ctx.fillRect(field.getX(index) * size, field.getY(index) * size, size, size);
        });
    }
}