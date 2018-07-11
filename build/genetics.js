"use strict";
class Candidate {
    constructor(values) {
        this.values = values;
        this.fitness = Game.simulateAndEvaluate(new Field(values));
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
        return this.mutateCandidate(this.singlePointCrossover(parent1, parent2));
    }
    static createNewGeneration(population) {
        const cutoff = Math.floor(this.Winners * this.Cutoff);
        const rest = new Array(this.Winners - cutoff)
            .fill(0)
            .map(() => population.candidates[Math.floor(Math.random() * (this.PopulationSize - cutoff)) + cutoff]);
        const winners = population.candidates.slice(0, cutoff).concat(rest);
        while (winners.length <= population.candidates.length) {
            const parent1 = randomFromArray(winners);
            const parent2 = randomFromArray(winners);
            if (parent1 === parent2)
                continue;
            winners.push(Population.breedCandidates(parent1, parent2));
        }
        return new Population(winners);
    }
    sort() {
        this.candidates = this.candidates
            .sort((a, b) => b.fitness - a.fitness);
    }
    static displayTable(population, table, canvas) {
        function htmlToElement(html) {
            const template = document.createElement('template');
            html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }
        while (table.firstChild)
            table.removeChild(table.firstChild);
        population.candidates.forEach((candidate, index) => {
            const row = htmlToElement(`<tr><td>${index}</td><td>${candidate.fitness}</td></tr>`);
            if (row) {
                row.addEventListener('click', () => {
                    Game.draw(new Field(candidate.values), canvas, Game.sizeOfCell);
                });
                table.appendChild(row);
            }
        });
    }
}
Population.Populations = 10000;
Population.PopulationSize = 100;
Population.Winners = 10;
Population.Cutoff = 0.5;
Population.MutationStrength = 5;
Population.singlePointCrossover = (parent1, parent2) => {
    const index = Math.floor(Math.random() * parent1.values.length);
    return new Candidate(parent1.values.slice(0, index).concat(parent2.values.slice(index)));
};
function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
//# sourceMappingURL=genetics.js.map