console.log("Copying the beta rivet config file")
let fs = require("fs")

let file = fs.readFileSync("./server/deploying/beta-rivet.toml", "utf-8")
fs.writeFileSync("./rivet.toml", file, "utf-8")
console.log("Finished copying")
