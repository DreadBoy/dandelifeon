
let field = new Field(25);
field.setCell(0, 0, 1);
field.setCell(1, 2, 1);

const game = new Game(document.querySelector('#canvas'), 20);
game.draw(field);