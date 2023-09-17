(async function () {
    const { Worker, isMainThread, parentPort } = require("worker_threads");
    const fasttalk = require("../lib/fasttalk.js");
    let queue = [];
    function tick() {
        for (let i = 0; i < Math.min(queue.length, 64); i++) {
            let job = queue.shift();
            if (job) {
                try {
                    parentPort.postMessage({
                        id: job.id,
                        packet: (job.method || "encode") === "encode" ? fasttalk.encode(job.packet) : fasttalk.decode(job.packet)
                    });
                } catch (error) {
                    parentPort.postMessage({
                        id: job.id,
                        packet: new Uint8Array([0, 0])
                    });
                }
            }
        }
        setTimeout(tick);
    }
    tick();
    parentPort.on("message", function (job) {
        queue.push(job);
    });
})();