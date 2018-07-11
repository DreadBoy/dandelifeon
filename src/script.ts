
let field = new Field(25);
field.setCell(12, 12, new Cell(2));

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const buttonStep = document.querySelector('#buttonStep') as HTMLButtonElement;
const buttonRun = document.querySelector('#buttonRun') as HTMLButtonElement;
const buttonImport = document.querySelector('#import') as HTMLButtonElement;
const buttonExport = document.querySelector('#export') as HTMLButtonElement;
const textarea = document.querySelector('#textarea') as HTMLTextAreaElement;

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

buttonExport.addEventListener('click', () => {
    textarea.value = field.export();
});

buttonImport.addEventListener('click', () => {
    field.import(textarea.value);
    game.draw(field);
});