"use strict";
class Candidate {
    constructor(values) {
        this.values = values;
        this.fitness = Game.getFitness(new Field(values));
    }
}
class Population {
    constructor(candidates) {
        if (candidates)
            this.candidates = candidates;
        else
            this.candidates = new Array(Population.PopulationSize)
                .fill(0)
                .map(() => new Candidate(new Array(Math.pow(Field.sizeOfField, 2))
                .fill(0)
                .map(() => Math.random() > 0.5 ? 1 : 0)));
    }
    static mutateCandidate(candidate) {
        const values = candidate.values;
        for (let i = 0; i < this.MutationStrength; i++) {
            const index = Math.floor(Math.random() * values.length);
            if (values[index] === 0)
                values[index] = 1;
            else if (values[index] === 1)
                values[index] = 0;
        }
        return new Candidate(values);
    }
    static breedCandidates(parent1, parent2) {
        const method = this.twoPointCrossover;
        return this.mutateCandidate(method(parent1, parent2));
    }
    static createNewGeneration(population) {
        const cutoff = Math.floor(this.Winners * this.Cutoff);
        const rest = new Array(this.Winners - cutoff)
            .fill(0)
            .map(() => population.candidates[Math.floor(Math.random() * (this.PopulationSize - cutoff)) + cutoff]);
        const winners = population.candidates.slice(0, cutoff).concat(rest);
        while (winners.length <= Population.PopulationSize) {
            const parent1 = randomFromArray(winners);
            const parent2 = randomFromArray(winners);
            if (parent1 === parent2)
                continue;
            winners.push(Population.breedCandidates(parent1, parent2));
        }
        return new Population(winners);
    }
    static bestFitness(population) {
        return this.bestCandidate(population).fitness;
    }
    static bestCandidate(population) {
        return population.candidates[0];
    }
    sort() {
        this.candidates = this.candidates
            .sort((a, b) => b.fitness - a.fitness);
    }
    static displayResults(populations, iterations, table) {
        function htmlToElement(html) {
            const template = document.createElement('template');
            html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }
        while (table.firstChild)
            table.removeChild(table.firstChild);
        const header = htmlToElement(`<tr><th>Population</th><th>Iteration</th><th>Best fitness</th><th>Best mana</th></tr>`);
        table.appendChild(header);
        populations
            .map((pop, index) => ({
            index,
            pop,
            it: iterations[index],
        }))
            .sort((a, b) => Population.bestFitness(b.pop) - Population.bestFitness(a.pop))
            .forEach(obj => {
            const best = Population.bestCandidate(obj.pop);
            const field = new Field(best.values);
            const row = htmlToElement(`<tr><td>${obj.index}</td><td>${obj.it}</td><td>${best.fitness}</td><td>${Game.runAndEvaluate(field)}</td></tr>`);
            if (row) {
                row.addEventListener('click', () => {
                    console.log(field.export());
                });
                table.appendChild(row);
            }
        });
    }
}
Population.Populations = 10000;
Population.PopulationSize = 100;
Population.Winners = 40;
Population.Cutoff = 0.5;
Population.MutationStrength = 10;
Population.singlePointCrossover = (parent1, parent2) => {
    const index = Math.floor(Math.random() * parent1.values.length);
    return new Candidate(parent1.values.slice(0, index).concat(parent2.values.slice(index)));
};
Population.twoPointCrossover = (parent1, parent2) => {
    const index = Math.floor(Math.random() * parent1.values.length);
    let index2 = -1;
    while (index === index2 || index2 === -1)
        index2 = Math.floor(Math.random() * parent1.values.length);
    const index1 = Math.min(index, index2);
    index2 = Math.max(index, index2);
    return new Candidate(parent1.values.slice(0, index1)
        .concat(parent2.values.slice(index1, index2))
        .concat(parent1.values.slice(index2)));
};
Population.uniformCrossover = (parent1, parent2) => {
    const bits = parent1.values.map((_, index) => Math.random() < 0.5 ? parent1.values[index] : parent2.values[index]);
    return new Candidate(bits);
};
function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
//# sourceMappingURL=genetics.js.map