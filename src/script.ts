let population: Population;

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const buttonGenerate = document.querySelector('#buttonGenerate') as HTMLButtonElement;
const buttonEvaluate = document.querySelector('#buttonEvaluate') as HTMLButtonElement;
const table = document.querySelector('#table') as HTMLTableElement;

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