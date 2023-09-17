let baseConfig = require("./config.json");
module.exports = file => {
    try {
        let data = require("./" + file);
        for (let key in data) {
            baseConfig[key] = data[key];
        }
    } catch(e) {
        console.log("Failed to load", file, "using defaults instead...");
    }
    return baseConfig;
}