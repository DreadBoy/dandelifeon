class Cell {

    public value: number;
    public age: number;

    constructor(value: number, age?: number) {
        this.value = value;
        this.age = 0;
        if (value > 0)
            this.age = age ? age : 0;
        this.age = Math.min(this.age, 100);
    }
}

class Field {

    public data: Cell[];
    public size: number;
    public finished: boolean = false;
    public static readonly sizeOfField = 25;

    constructor(param?: Field | number[]) {
        if (param instanceof Field) {
            this.data = param.data.map(cell => new Cell(cell.value, cell.age));
            this.size = param.size;
        }
        else if (Array.isArray(param)) {
            this.data = param.map(value => new Cell(value, 0));
            this.size = Math.sqrt(param.length);
        }
        else {
            this.data = [];
            for (let i = 0; i < Field.sizeOfField * Field.sizeOfField; i++)
                this.data[i] = new Cell(0);
            this.size = Field.sizeOfField;
        }
        const center = Math.floor(Field.sizeOfField / 2);
        this.setCell(center, center, new Cell(2));
    }

    getX(index: number) {
        return index % this.size;
    }

    getY(index: number) {
        return Math.floor(index / this.size);
    }

    getCellByIndex(index: number) {
        return this.getCell(this.getX(index), this.getY(index));
    }

    getCell(x: number, y: number) {
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

    setCell(x: number, y: number, cell: Cell) {
        this.data[y * this.size + x] = cell;
    }

    getNeighbours(x: number, y: number) {
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

    countAliveCells(x: number, y: number) {
        return this.getNeighbours(x, y).filter(n => n.value === 1).reduce((acc, curr) => acc + curr.value, 0);
    }

    export() {
        return this.data.map(cell => `${cell.value}|${cell.age}`).join(' ');
    }
}

class Game {

    public static readonly sizeOfCell = 15;

    static step(field: Field): Field {
        if (field.finished)
            return field;
        const result = new Field(field);
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

    static draw(field: Field, canvas: HTMLCanvasElement, sizeOfCell: number) {
        const height = canvas.height = Field.sizeOfField * sizeOfCell;
        const width = canvas.width = Field.sizeOfField * sizeOfCell;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        ctx.clearRect(0, 0, width, height);
        field.data.forEach((cell, index) => {
            if (cell.value === 1) {
                ctx.fillStyle = 'MEDIUMSEAGREEN';
                ctx.fillRect(field.getX(index) * sizeOfCell, field.getY(index) * sizeOfCell, sizeOfCell, sizeOfCell);
            }
            if (cell.value === 2) {
                ctx.fillStyle = 'TOMATO';
                ctx.fillRect(field.getX(index) * sizeOfCell, field.getY(index) * sizeOfCell, sizeOfCell, sizeOfCell);
            }
            ctx.fillStyle = 'black';
            if (cell.age > 0)
                ctx.fillText(cell.age.toString(), field.getX(index) * sizeOfCell + sizeOfCell / 4, field.getY(index) * sizeOfCell + sizeOfCell / 4 * 3)

        });
    }

    static evaluate(field: Field): number {
        const center = Math.floor(field.size / 2);
        return field.getNeighbours(center, center).reduce((acc, curr) => curr.value === 2 ? acc : acc + curr.value * curr.age, 0);
    }

    static runAndEvaluate(field: Field): number {
        for (let i = 0; i < 100; i++) {
            field = this.step(field);
        }
        return this.evaluate(field);
    }

    static getFitness(field: Field): number {
        const numberOfEmptyBlocks = field.data.filter(cell => cell.value === 0).length;
        return this.runAndEvaluate(field) * 0.3 + numberOfEmptyBlocks * 0.7;
    }
}