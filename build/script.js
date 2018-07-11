"use strict";
let field = new Field();
field.randomize();
const canvas = document.querySelector('#canvas');
const buttonStep = document.querySelector('#buttonStep');
const buttonRun = document.querySelector('#buttonRun');
const buttonImport = document.querySelector('#import');
const buttonExport = document.querySelector('#export');
const textarea = document.querySelector('#textarea');
Game.draw(field, canvas, 25);
canvas.addEventListener('click', (event) => {
    const box = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - box.left) / 25);
    const y = Math.floor((event.clientY - box.top) / 25);
    const cell = field.getCell(x, y);
    if (cell.value === 2)
        return;
    cell.value = +!cell.value;
    field.setCell(x, y, cell);
    Game.draw(field, canvas, 25);
});
buttonStep.addEventListener('click', () => {
    field = Game.step(field);
    Game.draw(field, canvas, 25);
    if (field.finished) {
        const mana = Game.evaluate(field);
        alert(`You got ${mana} mana!`);
    }
});
let animating = false;
buttonRun.addEventListener('click', () => {
    const step = () => {
        if (!animating)
            return;
        field = Game.step(field);
        Game.draw(field, canvas, 25);
        if (field.finished) {
            const mana = Game.evaluate(field);
            alert(`You got ${mana} mana!`);
            animating = false;
        }
        else
            requestAnimationFrame(step);
    };
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
    Game.draw(field, canvas, 25);
});
//# sourceMappingURL=script.js.map