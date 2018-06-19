class Cell {
    constructor(value, age) {
        this.value = value;
        this.age = 0;
        if (value > 0)
            this.age = age ? age : 0;
        this.age = Math.min(this.age, 100);
    }
}

class Field {

    constructor(size) {
        this.data = [];
        for (let i = 0; i < size * size; i++)
            this.data[i] = new Cell(0);
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
            return new Cell(0);
        if (x > this.size - 1)
            return new Cell(0);
        if (y < 0)
            return new Cell(0);
        if (y > this.size - 1)
            return new Cell(0);
        return this.data[y * this.size + x];
    }

    setCell(x, y, cell) {
        this.data[y * this.size + x] = cell;
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
        return this.getNeighbours(x, y).filter(n => n.value === 1).reduce((acc, curr) => acc + curr.value, 0);
    }

    export() {
        return this.data.map(cell => `${cell.value}|${cell.age}`).join(' ');
    }

    import(str) {
        this.data = str.split(' ').map(c => {
            const data = c.split('|');
            return new Cell(parseInt(data[0]), data[1]);
        });
        this.finished = false;
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

        result.data = result.data.map((_, index) => {
            const aliveNeighbours = field.countAliveCells(field.getX(index), field.getY(index));
            const oldCell = field.getCellByIndex(index);
            if (oldCell.value === 2)
                return new Cell(oldCell.value, oldCell.age);
            if (oldCell.value === 1) {
                // 1
                if (aliveNeighbours < 2 || aliveNeighbours > 3)
                    return new Cell(0);
                // 2
                else if (aliveNeighbours === 2 || aliveNeighbours === 3)
                    return new Cell(oldCell.value, oldCell.age + 1);
            }
            // 3
            else if (oldCell.value === 0 && aliveNeighbours === 3) {
                const ages = field.getNeighbours(field.getX(index), field.getY(index))
                    .filter(n => n.value === 1)
                    .map(n => n.age);
                return new Cell(1, Math.max.apply(null, ages) + 1);

            }
            return new Cell(0);
        });

        const criticalNeighbours = result.countAliveCells(center, center);
        if (criticalNeighbours > 0) {
            result.finished = true;
        }
        return result;
    }

    draw(field) {
        const size = this.sizeOfCell;
        this.ctx.clearRect(0, 0, this.width, this.height);
        field.data.forEach((cell, index) => {
            if (cell.value === 1) {
                this.ctx.fillStyle = 'MEDIUMSEAGREEN';
                this.ctx.fillRect(field.getX(index) * size, field.getY(index) * size, size, size);
            }
            if (cell.value === 2) {
                this.ctx.fillStyle = 'TOMATO';
                this.ctx.fillRect(field.getX(index) * size, field.getY(index) * size, size, size);
            }
            this.ctx.fillStyle = 'black';
            if (cell.age > 0)
                this.ctx.fillText(cell.age, field.getX(index) * size + size / 4, field.getY(index) * size + size / 4 * 3)

        });
    }

    evaluate(field) {

        const center = Math.floor(field.size / 2);
        const mana = field.getNeighbours(center, center).reduce((acc, curr) => curr.value === 2 ? acc : acc + curr.value * curr.age, 0);
        return mana;
    }
}