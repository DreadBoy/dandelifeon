"use strict";
let population;
const canvas = document.querySelector('#canvas');
const buttonGenerate = document.querySelector('#buttonGenerate');
const buttonEvaluate = document.querySelector('#buttonEvaluate');
const table = document.querySelector('#table');
buttonGenerate.addEventListener('click', () => {
    if (!population)
        population = new Population();
    else {
        population = Population.createNewGeneration(population);
    }
});
buttonEvaluate.addEventListener('click', () => {
    if (!population)
        return;
    population.sort();
    population.displayTable(table, canvas);
    Game.draw(new Field(population.candidates[0].values), canvas, Game.sizeOfCell);
});
//# sourceMappingURL=script.js.map