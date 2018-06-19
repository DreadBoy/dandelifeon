
let field = new Field(25);
field.setCell(1, 2, 1);
field.setCell(2, 2, 1);
field.setCell(3, 2, 1);
field.setCell(0, 3, 1);
field.setCell(1, 3, 1);
field.setCell(2, 3, 1);


const game = new Game(document.querySelector('#canvas'), 20);
game.draw(field);

const button = document.querySelector('#button');
button.addEventListener('click', () => {
    field = game.step(field);
    game.draw(field);
});