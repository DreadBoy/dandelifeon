interface StepEvent extends MessageEvent {
    data: Population
}

declare function postMessage(message: Population): void

importScripts('genetics.js', 'game.js');

onmessage = (message: StepEvent) => {
    let pop = message.data;
    if (!pop)
        pop = new Population();
    else {
        pop = Population.createNewGeneration(pop);
    }
    pop.sort();
    postMessage(pop);
};