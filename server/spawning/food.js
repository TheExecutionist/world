const Spawner = require("./spawningClass.js").Spawner

const FoodSpawner = new Spawner([
    // Normal
    "egg",
    "square",
    "triangle",
    "pentagon"
])

module.exports = {
    FoodSpawner
}
