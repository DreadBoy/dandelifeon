class Field {

    constructor(size) {
        this.data = [];
        for (let i = 0; i < size * size; i++)
            this.data[i] = 0;
        this.size = size;
        this.finished = false;
    }

    getX(index) {
        return index % this.size;
    }

    getY(index) {
        return Math.floor(index / this.size);
    }

    getCellByIndex(index) {
        return this.getCell(this.getX(index), this.getY(index));
    }

    getCell(x, y) {
        if (x < 0)
            return 0;
        if (x > this.size - 1)
            return 0;
        if (y < 0)
            return 0;
        if (y > this.size - 1);
        return this.data[y * this.size + x];
    }

    setCell(x, y, value) {
        this.data[y * this.size + x] = value;
    }

    getNeighbours(x, y) {
        return [
            this.getCell(x - 1, y - 1),
            this.getCell(x - 1, y),
            this.getCell(x - 1, y + 1),
            this.getCell(x, y - 1),
            this.getCell(x, y + 1),
            this.getCell(x + 1, y - 1),
            this.getCell(x + 1, y),
            this.getCell(x + 1, y + 1),
        ];
    }

    countAliveCells(x, y) {
        return this.getNeighbours(x, y).reduce((acc, curr) => acc + curr, 0);
    }
}


class Game {

    constructor(canvas, sizeOfCell) {
        this.height = canvas.height = 25 * sizeOfCell;
        this.width = canvas.width = 25 * sizeOfCell;
        this.ctx = canvas.getContext("2d");
        this.sizeOfCell = sizeOfCell;
    }

    step(field) {
        if (field.finished)
            return field;
        const result = new Field(field.size);
        const center = Math.floor(field.size / 2);
        const aliveNeighbours = field.countAliveCells(center, center);

        if (field.getCell(center, center) === 2 && aliveNeighbours > 0) {
            result.finished = true;
            result.data = field.data.map(_ => _);
            return result;
        }
        else
            result.data = result.data.map((_, index) => {
                const aliveNeighbours = field.countAliveCells(field.getX(index), field.getY(index));
                if (field.getCellByIndex(index) === 2)
                    return 2;
                if (field.getCellByIndex(index) === 1) {
                    // 1
                    if (aliveNeighbours < 2 || aliveNeighbours > 3)
                        return 0;
                    // 2
                    else if (aliveNeighbours === 2 || aliveNeighbours === 3)
                        return 1;
                }
                // 3
                else if (field.getCellByIndex(index) === 0 && aliveNeighbours === 3)
                    return 1;
                return 0;
            });
        return result;
    }

    draw(field) {
        const size = this.sizeOfCell;
        this.ctx.clearRect(0, 0, this.width, this.height);
        field.data.forEach((cell, index) => {
            if (cell === 1) {
                this.ctx.fillStyle = 'MEDIUMSEAGREEN';
                this.ctx.fillRect(field.getX(index) * size, field.getY(index) * size, size, size);
            }
            if (cell === 2) {
                this.ctx.fillStyle = 'TOMATO';
                this.ctx.fillRect(field.getX(index) * size, field.getY(index) * size, size, size);
            }

        });
    }

    evaluate(field) {
        const mana = field.data.reduce((acc, curr) => curr === 2 ? acc : acc + curr);
        return mana;
    }
}