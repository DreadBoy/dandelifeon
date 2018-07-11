class Population {

    public candidates: Field[];

    constructor(number: number) {
        this.candidates = new Array(number).fill(0).map(_ => {
            const field = new Field(25);
            field.randomize();
            return field;
        });
    }

    public mutateAll() {
        this.candidates.forEach(Population.mutate);
    }

    public static mutate(field: Field) {
        const mutated = new Field(field);
        const index = Math.floor(Math.random() * mutated.data.length);
        if (mutated.data[index].value === 0)
            mutated.data[index].value = 1
        else if (mutated.data[index].value === 1)
            mutated.data[index].value = 0
        return mutated;
    }
}