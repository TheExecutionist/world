const fs = require('fs');
global.utility = require("./util.js");
let Class = require(`./definitions`);

const findXInY = (inX, inY) => {
    let count = 0,
        x = Class[inX],
        y = Class[inY],
        specialKeys = ['PARENT', 'TYPE'];

    (function loop(input) {
        if (count == 0) { 
            for (let key in input) {
                if (typeof input[key] == 'object') {
                    if (Array.isArray(input[key])) {
                        if (specialKeys.includes(key)) {
                            if (input[key][0] == x) return count++;
                        } else for (let bit of input[key]) {
                            if (bit == x) return count++;
                            if (count > 0) break;
                            if (!key.includes('UPGRADES_TIER_')) loop(bit);
                        }
                    } else {
                        if (input[key] == x || key == 'IS_USED') return count++;
                        if (!specialKeys.includes(key)) loop(input[key]);
                    }
                }
            }
        }
    })(y);
    
    return count;
};

let outputText = '';

fs.writeFileSync('unusedOutput.txt', 'Hello world\nTanks go here!');

for (let inX in Class) {
    let found = false;
    if (Class[inX] == undefined) console.log(`inX error! ${inX} doesn't exist! Skipping to the next export...`);
    else if (!Class[inX].IS_USED) {
        for (let inY in Class) {
            if (Class[inY] == undefined) console.log(`inY error! ${inY} doesn't exist! Skipping to the next export...`);
            else if (findXInY(inX, inY) > 0) {
                found = true;
                break;
            }
        }

        if (!found) {
            console.log(`${inX}`);
            outputText += `exports.${inX},\n`;
        }
    }
}

fs.writeFileSync('unusedOutput.txt', outputText);
console.log('Snail!');
