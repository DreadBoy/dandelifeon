
let field = new Field(25);
field.setCell(1, 2, new Cell(1));
field.setCell(2, 2, new Cell(1));
field.setCell(3, 2, new Cell(1));
field.setCell(0, 3, new Cell(1));
field.setCell(1, 3, new Cell(1));
field.setCell(2, 3, new Cell(1));

field.setCell(12, 12, new Cell(2));

const canvas = document.querySelector('#canvas');
const buttonStep = document.querySelector('#buttonStep');
const buttonRun = document.querySelector('#buttonRun');

const game = new Game(canvas, 20);
game.draw(field);

canvas.addEventListener('click', (event) => {
    const box = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - box.left) / game.sizeOfCell);
    const y = Math.floor((event.clientY - box.top) / game.sizeOfCell);
    const cell = field.getCell(x, y);
    if (cell.value === 2)
        return;
    cell.value = +!cell.value;
    field.setCell(x, y, cell)
    game.draw(field);
});

buttonStep.addEventListener('click', () => {
    field = game.step(field);
    game.draw(field);
    if (field.finished) {
        const mana = game.evaluate(field);
        alert(`You got ${mana} mana!`);
    }
});

let animating = false;

buttonRun.addEventListener('click', () => {
    const step = () => {
        if (!animating)
            return;
        field = game.step(field);
        game.draw(field);
        if (field.finished) {
            const mana = game.evaluate(field);
            alert(`You got ${mana} mana!`);
            animating = false;
        }
        else
            requestAnimationFrame(step);
    }
    
    if (animating) {
        animating = false;
    }
    else {
        requestAnimationFrame(step);
        animating = true;
    }
});