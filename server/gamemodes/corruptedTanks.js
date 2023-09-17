const fs = require("fs")
const util = require("../../lib/util.js")
const CONFIG = {
    usedTanks: 5, // Number of tanks used per generated tank
    maxChildren: 30, // The overall max children a singluar tank can have
    labelLength: 16, // The random amount of label per tank to use
    gunsPerTank: 7, // The max amount of guns to use from each tank
    turretsPerTank: 2, // The max amount of turrets to use from each tank
    propsPerTank: 2, // The max amount of props to use from each tank
}

let defs = require("../../lib/definitions.js")
defs = Object.entries(defs)

let maxDefLength = defs.length
for(let arr of defs){
    arr[1].MAX_CHILDREN = CONFIG.maxChildren
    arr[1].ON_TICK = function(me){
        let children = 0;
        if (me.childrenMap.size) {
            let entries = [...me.childrenMap.entries()].reverse()
            for (let v of entries) {
                children++
                if (children > CONFIG.maxChildren) {
                    v[1].kill()
                    me.childrenMap.delete(v[0])
                }
            }
        }
    }
    if(arr[1].GUNS != null){
        for(let gun of arr[1].GUNS){
            if(gun.PROPERTIES != null){
                gun.PROPERTIES.MAX_CHILDREN = CONFIG.maxChildren
                gun.PROPERTIES.DESTROY_OLDEST_CHILD = true
            }
        }
    }
}

function generateNewTank(){
    let label = ""
    let finalTank = defs[Math.random() * defs.length | 0][1]
    finalTank.GUNS = []
    finalTank.TURRETS = []
    finalTank.LASERS = []
    finalTank.PROPS = []

    for(let i = 0; i < CONFIG.usedTanks; i++){
        let entity = defs[(Math.random() * maxDefLength | 0)][1]

        if(entity.LABEL){
            let end = Math.random()*entity.LABEL.length|0
            if(label.length+end < CONFIG.labelLength){
                label += entity.LABEL.substring(0, end)
            }
        }

        if(entity.GUNS){
            for(let a = 0; a < CONFIG.gunsPerTank; a++){
                let gun = entity.GUNS[(Math.random() * entity.GUNS.length | 0)]
                if(!gun) continue;
                if(gun.PROPERTIES){

                }
                finalTank.GUNS.push(gun)
            }
        }

        if (entity.TURRETS) {
            for (let a = 0; a < CONFIG.turretsPerTank; a++) {
                let turret = entity.TURRETS[(Math.random() * entity.TURRETS.length | 0)]
                if (!turret) continue;
                turret.MAX_CHILDREN = CONFIG.maxChildren
                if (turret.GUNS != null) {
                    for (let gun of turret.GUNS) {
                        if (gun.PROPERTIES != null) {
                            gun.PROPERTIES.MAX_CHILDREN = CONFIG.maxChildren
                            gun.PROPERTIES.DESTROY_OLDEST_CHILD = true
                        }
                    }
                }
                finalTank.TURRETS.push(turret)
            }
        }

        if (entity.PROPS) {
            for (let a = 0; a < CONFIG.propsPerTank; a++) {
                let prop = entity.PROPS[(Math.random() * entity.PROPS.length | 0)]
                if (!prop) continue;
                finalTank.PROPS.push(prop)
            }
        }
    }

    finalTank.LABEL = label
    if(finalTank?.PARENT?.length)finalTank.PARENT[0].CONTROLLERS = []
    finalTank.CONTROLLERS = []
    finalTank.TYPE = "tank"
    finalTank.DIE_AT_LOW_SPEED = false
    finalTank.DIE_AT_RANGE = false
    finalTank.INDEPENDANT = true
    finalTank.HAS_NO_MASTER = true
    finalTank.ACCEPTS_SCORE = true
    finalTank.CAN_BE_ON_LEADERBOARD = true
    finalTank.GOD_MODE = false
    finalTank.IS_ARENA_CLOSER = false
    finalTank.PASSIVE = false
    finalTank.STAT_NAMES = 6 // generic
    finalTank.SKILL_CAP = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
    finalTank.AI = {}
    //finalTank.MOTION_TYPE = 'motor'
    //finalTank.FACING_TYPE = 'toTarget'
    finalTank.SANCTUARY_TYPE = 'None'
    finalTank.BOSS_TYPE = 'None'
    finalTank.RANDOM_TYPE = 'None'
    finalTank.MISC_IDENTIFIER = "None"
    finalTank.MAX_CHILDREN = (CONFIG.usedTanks*CONFIG.gunsPerTank*CONFIG.maxChildren)*0.5

    let exportName = `${Date.now()}-${Math.random()}`
    global.addNewClass(exportName, finalTank)
    return exportName
}

module.exports = {
    generateNewTank
}
