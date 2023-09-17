class Spawner {
    constructor(entities) {
        this.entities = [];
        for (let entity of entities) {
            if (typeof entity === "string") {
                this.entities.push(entity)
                continue;
            }
            while (entity[1]--) {
                this.entities.push(entity[0])
            }
        }
        this.bias = 0
        this.biasInfluence = 1
    }
    getEntity() { // Chance to get that entity gets lower the further down it is
        return this.entities[Math.min(Math.random() * this.entities.length * (1 - Math.random() * this.biasInfluence) | 0, this.entities.length-1)]
    }
}

module.exports = {
    Spawner
}