let workers = new Array(10).fill(undefined);
let populations: Population[] = [];
let iterations = new Array(workers.length).fill(0);
let bestPopulation: Population;

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const buttonRun = document.querySelector('#buttonRun') as HTMLButtonElement;
const buttonStop = document.querySelector('#buttonStop') as HTMLButtonElement;
const table = document.querySelector('#table') as HTMLTableElement;

buttonRun.addEventListener('click', () => {
    if (iterations.reduce((acc, curr) => acc + curr) === 0) {
        workers = workers.map(() => new Worker('build/worker.js'));
        workers.forEach((worker, index) => {
            worker.onmessage = (event: StepEvent) => {
                populations[index] = event.data;
                Population.displayResults(populations, iterations, table);
                const bestFitness = bestPopulation ? Population.bestFitness(bestPopulation) : 0;
                if (Population.bestFitness(populations[index]) > bestFitness) {
                    bestPopulation = populations[index];
                    const field = new Field(bestPopulation.candidates[0].values);
                    Game.draw(field, canvas, Game.sizeOfCell);
                    // console.log(`Population ${index}, iteration ${
                    //     iterations[index]}, fitness ${
                    //     populations[index].candidates[0].fitness}, mana ${
                    //     Game.runAndEvaluate(field)}, export ${
                    //     field.export()
                    //     }`, '');
                }
                iterations[index]++;
                if (iterations[index] < Population.Populations)
                    worker.postMessage(populations[index]);
            };
            worker.postMessage(undefined);
        });
    }
});

buttonStop.addEventListener('click', () => {
    workers.forEach(worker => worker.terminate());
    populations = [];
    iterations = new Array(workers.length).fill(0);
});
buttonRun.click();