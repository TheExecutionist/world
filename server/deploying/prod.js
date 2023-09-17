console.log("Copying the production rivet config file")
let fs = require("fs")

let file = fs.readFileSync("./server/deploying/prod-rivet.toml", "utf-8")
fs.writeFileSync("./rivet.toml", file, "utf-8")
console.log("Finished copying")