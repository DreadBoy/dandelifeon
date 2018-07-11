"use strict";
importScripts('genetics.js', 'game.js');
onmessage = (message) => {
    let pop = message.data;
    if (!pop)
        pop = new Population();
    else {
        pop = Population.createNewGeneration(pop);
    }
    pop.sort();
    postMessage(pop);
};
//# sourceMappingURL=worker.js.map