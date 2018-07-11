let worker = new Worker('build/worker.js');
let population: Population;
let iteration = 0;

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const buttonGenerate = document.querySelector('#buttonGenerate') as HTMLButtonElement;
const buttonEvaluate = document.querySelector('#buttonEvaluate') as HTMLButtonElement;
const buttonRun = document.querySelector('#buttonRun') as HTMLButtonElement;
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
    Population.displayTable(population, table, canvas);
    Game.draw(new Field(population.candidates[0].values), canvas, Game.sizeOfCell);
});

worker.onmessage = (event: StepEvent) => {
    population = event.data;
    Population.displayTable(population, table, canvas);
    Game.draw(new Field(population.candidates[0].values), canvas, Game.sizeOfCell);
    iteration++;
    console.log(`Iteration ${iteration}: ${population.candidates[0].fitness}`, '');
    if (iteration < Population.Populations)
        worker.postMessage(population);
};

buttonRun.addEventListener('click', () => {
    if (iteration < Population.Populations)
        worker.postMessage(population);
});