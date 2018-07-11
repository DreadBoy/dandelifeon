"use strict";
class Population {
    constructor(number) {
        this.candidates = new Array(number).fill(0).map(_ => {
            const field = new Field();
            field.randomize();
            return field;
        });
    }
    mutateAll() {
        this.candidates.forEach(Population.mutate);
    }
    static mutate(field) {
        const mutated = new Field(field);
        const index = Math.floor(Math.random() * mutated.data.length);
        if (mutated.data[index].value === 0)
            mutated.data[index].value = 1;
        else if (mutated.data[index].value === 1)
            mutated.data[index].value = 0;
        return mutated;
    }
}
//# sourceMappingURL=genetics.js.map