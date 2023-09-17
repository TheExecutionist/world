const Spawner = require("./spawningClass.js").Spawner

const SanctuarySpawner = new Spawner([
    ["eggSanctuary", 3],
    ["squareSanctuary", 3],
    ["triSanctuary", 2],
    "pentaSanctuary",
    "alphaCrasher",
    "bowedSanc",
    "sunKing",
    "snowballSanctuary"
])

module.exports = {
    SanctuarySpawner
}