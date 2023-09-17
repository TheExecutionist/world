const { EventEmitter } = require('stream');
const WebSocket = require("ws");
const util = require("../../lib/util.js")
const lobbyId = (process.env.RIVET_LOBBY_ID || `DEVELOPR-${(Math.random() * 1e4) | 0}-${(Math.random() * 1e4) | 0}-${(Math.random() * 1e4) | 0}-${(Math.random() * 1e4) | 0}${(Math.random() * 1e4) | 0}${(Math.random() * 1e4) | 0}`)

let apiEvent = new EventEmitter()
let apiConnection;
async function connectToApi(c) {
    apiConnection = new WebSocket(`${c.api_ws_url}/${process.env.API_CONNECTION_KEY}`)
    apiConnection.on("error", () => {
        util.error("Issue when connecting to the api via websockets, shutting down")
        process.exit()
    })
    apiConnection.on("open", () => {
        util.log("Connected to the api")
        apiConnection.talk({
            type: "init",
            data: {
                lobbyId: lobbyId,
                region: process.env.RIVET_REGION_NAME || "Unknown",
                rivetGamemodeId: process.env.RIVET_GAME_MODE_NAME || "0",
                maxPlayerCount: process.env.RIVET_MAX_PLAYERS_NORMAL || "32"
            }
        })
    })
    apiConnection.on("close", () => {
        util.log("Connection with the api closed, reconnecting in 12 seconds..")
        setTimeout(() => {
            connectToApi(c)
        }, 12000)
    })
    apiConnection.on("message", (data) => {
        data = JSON.parse(data)
        apiEvent.emit(data.type, data)
    })
    apiConnection.talk = (data) => {
        if (apiConnection.readyState !== 1) {
            return
        }
        apiConnection.send(JSON.stringify(data))
    }
    return {
        apiConnection, apiEvent
    }
}

function getApiStuff(){
    return {
        apiConnection,
        apiEvent
    }
}

module.exports = {
    connectToApi,
    getApiStuff
}