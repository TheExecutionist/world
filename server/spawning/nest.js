const Spawner = require("./spawningClass.js").Spawner

const NestSpawner = new Spawner([
    "pentagon",
    "betaPentagon",
    "alphaPentagon",
    "splitterPentagon",
])

 
module.exports = {
    NestSpawner
}