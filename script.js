
let field = new Field(25);
field.setCell(1, 2, 1);
field.setCell(2, 2, 1);
field.setCell(3, 2, 1);
field.setCell(0, 3, 1);
field.setCell(1, 3, 1);
field.setCell(2, 3, 1);

field.setCell(12, 12, 2);

const canvas = document.querySelector('#canvas');
const game = new Game(canvas, 20);
game.draw(field);

const button = document.querySelector('#button');
button.addEventListener('click', () => {
    field = game.step(field);
    game.draw(field);
    if (field.finished)
    {
        const mana = game.evaluate(field);
        alert(`You got ${mana} mana!`);
    }
});

canvas.addEventListener('click', (event) => {
    const box = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - box.left) / game.sizeOfCell);
    const y = Math.floor((event.clientY - box.top) / game.sizeOfCell);
    const cell = field.getCell(x, y);
    if (cell === 2)
        return;
    field.setCell(x, y, +!cell)
    game.draw(field);
});