const util = require("./util.js");
const log = {};

function update(players) {
    let ids = [];
    for (let player of players) {
        if (player.body) {
            ids.push(player.body.id);
            if (log[player.body.id] == null) {
                let command = (player.command || {}).report || [0, 0, 0];
                log[player.body.id] = {
                    id: player.body.id,
                    tank: player.body.label,
                    name: player.body.name,
                    x: player.body.x,
                    y: player.body.y,
                    threshold: player.body.realSize * 3,
                    commands: {
                        total: [
                            command
                        ],
                        average: command,
                        totalAngles: [
                            Math.atan2(command[1], command[0])
                        ],
                        averageAngle: Math.atan2(command[1], command[0])
                    }
                };
            } else {
                const command = log[player.body.id].commands;
                log[player.body.id] = {
                    id: player.body.id,
                    tank: player.body.label,
                    name: player.body.name,
                    x: player.body.x,
                    y: player.body.y,
                    threshold: player.body.realSize * 3,
                    commands: (function() {
                        let newThing = (player.command || {}).report || [0, 0, 0];
                        if (JSON.stringify(command.total[0]) !== JSON.stringify(newThing)) {
                            command.total.unshift(newThing);
                            command.totalAngles.unshift(Math.atan2(newThing[1], newThing[0]));
                        }
                        //command.total = [...new Set(command.total.map(r => JSON.stringify(r)))].map(r => JSON.parse(r));
                        command.total.length = Math.min(command.total.length, 25);
                        command.totalAngles.length = Math.min(command.totalAngles.length, 25);
                        command.average = [0, 0, 0];
                        for (let i = 0; i < command.total.length; i ++) {
                            command.average[0] += command.total[i][0];
                            command.average[1] += command.total[i][1];
                            command.average[2] += command.total[i][2];
                        }
                        command.average = command.average.map(r => r / command.total.length);
                        command.averageAngle = command.totalAngles.reduce((a, b) => a + b) / command.totalAngles.length;
                        return command;
                    })()
                };
            }
        }
    }
    for (let key in log) {
        if (!ids.includes(+key)) {
            delete log[key];
        }
    }
}

// https://stackoverflow.com/a/10473855/19730189
function Compare(strA, strB) {
    for (var result = 0, i = strA.length; i--;) {
        if (typeof strB[i] == 'undefined' || strA[i] == strB[i]);
        else if (strA[i].toLowerCase() == strB[i].toLowerCase())
            result++;
        else
            result += 4;
    }
    return 1 - (result + 4 * Math.abs(strA.length - strB.length)) / (2 * (strA.length + strB.length));
}

const mouseThreshold = 1;
const inputThreshold = 2;
const thresholdMultiplier = 2;
const angleThreshold = Math.PI / 50;
function test() {
    let badUsers = {};
    let players = Object.values(log);
    for (let player of players) {
        for (let other of players) {
            if (other.id === player.id || util.getDistance(other, player) > 12 + (other.threshold + player.threshold) * thresholdMultiplier) {
                continue;
            }
            let score = 0;

            if (other.name.toLowerCase().includes("multibox")) {
                score += .3;
            }

            if (Compare(player.name, other.name) >= .5) {
                score += .2;
            }
            if (player.tank === other.tank) {
                score += .2;
            }
            const inputs = {
                mouseX: Math.abs(other.commands.average[0] - player.commands.average[0]),
                mouseY: Math.abs(other.commands.average[1] - player.commands.average[1]),
                inputs: Math.abs(other.commands.average[2] - player.commands.average[2]),
                angle: Math.abs(other.commands.averageAngle - player.commands.averageAngle)
            };
            if ((inputs.angle <= angleThreshold || (inputs.mouseX <= mouseThreshold && inputs.mouseY <= mouseThreshold)) && inputs.inputs <= inputThreshold) {
                score += .6;
            }
            if (score > .8) {
                if (badUsers[other.id] == null) {
                    badUsers[other.id] = score;
                } else {
                    badUsers[other.id] = Math.min(1, badUsers[other.id] + score);
                }
            }
        }
        /*let others = players.filter(other => {
            return other.id === player.id;
            if (other.id === player.id) {
                return false;
            }
            return (Compare(player.name, other.name) >= .5 && player.tank === other.tank);
        });
        others = others.filter(other => { // Step 2, filter through to make sure they are near each other
            return util.getDistance(other, player) < 12 + (other.threshold + player.threshold) * thresholdMultiplier;
        });
        others = others.filter(other => { // Step 3, compare the averages, make sure they are similar enough
            let inputs = {
                mouseX: Math.abs(other.commands.average[0] - player.commands.average[0]),
                mouseY: Math.abs(other.commands.average[1] - player.commands.average[1]),
                inputs: Math.abs(other.commands.average[2] - player.commands.average[2]),
                angle: Math.abs(other.commands.averageAngle - player.commands.averageAngle)
            };
            return (
                (
                    inputs.angle <= angleThreshold ||
                    (
                        inputs.mouseX <= mouseThreshold &&
                        inputs.mouseY <= mouseThreshold
                    )
                ) &&
                inputs.inputs <= inputThreshold
            );
        });
        if (others.length) {
            if (!badUsers.includes(player.id)) {
                badUsers.push(player.id);
            }
        }
        for (let other of others) {
            if (!badUsers.includes(other.id)) {
                badUsers.push(other.id);
            }
        }*/
    }
    return badUsers;
}

module.exports = {
    update,
    test
};