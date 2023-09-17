// TEMPORARY: Quick and dirty solution to server.js being loaded asyncly, will be fixed when everything is split up
let serverjs;
let intvl = setInterval(()=>{
    serverjs = require("../../server.js")
    if(Object.keys(serverjs).length){
        clearInterval(intvl)
    }
}, 500)

// Defaults
// Applied to every mockup, adds the value if its missing
const defaults = {
    x: 0,
    y: 0,
    color: 16,
    shape: 0,
    size: 1,
    realSize: 1,
    facing: 0,
    layer: 0,
    statnames: 0,
    defaultArrayLength: 0,
    aspect: 1,
    skin: 0,
    colorUnmix: 0,
    angle: 0
};

function applyDefaults(mockup) {
    for (const key in mockup) {
        if (defaults[key] != null) {
            if (mockup[key] == defaults[key] || mockup[key] == null) {
                delete mockup[key];
            }
        } else if (Array.isArray(mockup[key]) && mockup[key].length === defaults.defaultArrayLength) {
            delete mockup[key];
        }
    }
    (mockup.guns || []).forEach(gun => {
        for (const key in gun) {
            if (defaults[key] != null) {
                if (gun[key] == defaults[key] || gun[key] == null) {
                    delete gun[key];
                }
            } else if (Array.isArray(mockup[key]) && gun[key].length === defaults.defaultArrayLength) {
                delete gun[key];
            }
        }
    });
    return mockup;
}


// Parsing
// Parses the mockups
class PriorityQueue {
    constructor() {
        this.clear();
    }
    clear() {
        this.array = [];
        this.sorted = true;
    }
    enqueue(priority, to) {
        this.array.push([priority, to]);
        this.sorted = false;
    }
    dequeue() {
        if (!this.sorted) {
            this.array.sort((a, b) => b[0] - a[0]);
            this.sorted = true;
        }
        return this.array.pop()[1];
    }
    getCount() {
        return this.array.length;
    }
}
function rounder(val) {
    if (Math.abs(val) < 0.001) val = 0;
    return +val.toPrecision(3);
}
const parseMockup = (e, p) => {
    return {
        index: e.index,
        name: e.label,
        x: rounder(e.x),
        y: rounder(e.y),
        color: e.color,
        shape: e.shapeData || 0,
        size: rounder(e.size),
        realSize: rounder(e.realSize),
        facing: rounder(e.facing),
        layer: e.layer,
        statnames: e.settings.skillNames,
        position: p,
        upgrades: e.upgrades.map(r => ({
            tier: r.tier,
            index: r.index
        })),
        guns: e.guns.map(g => {
            return {
                offset: rounder(g.offset),
                direction: rounder(g.direction),
                length: rounder(g.length),
                width: rounder(g.width),
                aspect: rounder(g.aspect),
                angle: rounder(g.angle),
                color: rounder(g.color),
                skin: rounder(g.skin),
                color_unmix: rounder(g.color_unmix),
                alpha: g.alpha
            };
        }),
        turrets: e.turrets.map(t => {
            let out = parseMockup(t, {});
            out.sizeFactor = rounder(t.bound.size);
            out.offset = rounder(t.bound.offset);
            out.direction = rounder(t.bound.direction);
            out.layer = rounder(t.bound.layer);
            out.angle = rounder(t.bound.angle);
            return applyDefaults(out);
        }),
        lasers: e.lasers.map(l => {
            return {
                offset: rounder(l.offset),
                direction: rounder(l.direction),
                length: rounder(l.length),
                width: rounder(l.width),
                aspect: rounder(l.aspect),
                angle: rounder(l.angle),
                color: rounder(l.color),
                laserWidth: rounder(l.laserWidth)
            };
        }),
        props: e.props.map(p => {
            return {
                size: rounder(p.size),
                x: rounder(p.x),
                y: rounder(p.y),
                angle: rounder(p.angle),
                layer: rounder(p.layer),
                color: rounder(p.color),
                shape: p.shape,
                fill: p.fill,
                loop: p.loop,
                isAura: p.isAura,
                rpm: p.rpm,
                specific: p.specific,
                dip: p.dip,
                ring: p.ring,
                arclen: p.arclen
            };
        })
    };
};

// Unknown
// I think this is what generates the upgrade icon data although im not sure
const lazyRealSizes = (() => {
    let o = [1, 1, 1];
    for (let i = 3; i < 17; i++) {
        // We say that the real size of a 0-gon, 1-gon, 2-gon is one, then push the real sizes of triangles, squares, etc...
        o.push(Math.sqrt((2 * Math.PI / i) * (1 / Math.sin(2 * Math.PI / i))));
    }
    return o;
})();
function getDimensions(entities) {
    let endpoints = [];
    let pointDisplay = [];
    let pushEndpoints = function (model, scale, focus = {
        x: 0,
        y: 0
    }, rot = 0) {
        let s = Math.abs(model.shape);
        let z = (Math.abs(s) > lazyRealSizes.length) ? 1 : lazyRealSizes[Math.abs(s)];
        if (z === 1) { // Body (octagon if circle)
            for (let i = 0; i < 2; i += 0.5) {
                endpoints.push({
                    x: focus.x + scale * Math.cos(i * Math.PI),
                    y: focus.y + scale * Math.sin(i * Math.PI)
                });
            }
        } else { // Body (otherwise vertices)
            for (let i = (s % 2) ? 0 : Math.PI / s; i < s; i++) {
                let theta = (i / s) * 2 * Math.PI;
                endpoints.push({
                    x: focus.x + scale * z * Math.cos(theta),
                    y: focus.y + scale * z * Math.sin(theta)
                });
            }
        }
        for (let i = 0; i < model.guns.length; i++) {
            let gun = model.guns[i];
            let h = gun.aspect > 0 ? ((scale * gun.width) / 2) * gun.aspect : (scale * gun.width) / 2;
            let r = Math.atan2(h, scale * gun.length) + rot;
            let l = Math.sqrt(scale * scale * gun.length * gun.length + h * h);
            let x = focus.x + scale * gun.offset * Math.cos(gun.direction + gun.angle + rot);
            let y = focus.y + scale * gun.offset * Math.sin(gun.direction + gun.angle + rot);
            endpoints.push({
                x: x + l * Math.cos(gun.angle + r),
                y: y + l * Math.sin(gun.angle + r)
            });
            endpoints.push({
                x: x + l * Math.cos(gun.angle - r),
                y: y + l * Math.sin(gun.angle - r)
            });
            pointDisplay.push({
                x: x + l * Math.cos(gun.angle + r),
                y: y + l * Math.sin(gun.angle + r)
            });
            pointDisplay.push({
                x: x + l * Math.cos(gun.angle - r),
                y: y + l * Math.sin(gun.angle - r)
            });
        }
        for (let i = 0; i < model.turrets.length; i++) {
            let turret = model.turrets[i];
            pushEndpoints(turret, turret.bound.size, {
                x: turret.bound.offset * Math.cos(turret.bound.angle),
                y: turret.bound.offset * Math.sin(turret.bound.angle)
            }, turret.bound.angle);
        }
    };
    pushEndpoints(entities, 1);
    // 2) Find their mass center
    let massCenter = {
        x: 0,
        y: 0
    };
    // 3) Choose three different points (hopefully ones very far from each other)
    let chooseFurthestAndRemove = function (furthestFrom) {
        let index = 0;
        if (furthestFrom != -1) {
            let list = new PriorityQueue();
            let d;
            for (let i = 0; i < endpoints.length; i++) {
                let thisPoint = endpoints[i];
                d = Math.pow(thisPoint.x - furthestFrom.x, 2) + Math.pow(thisPoint.y - furthestFrom.y, 2) + 1;
                list.enqueue(1 / d, i);
            }
            index = list.dequeue();
        }
        let output = endpoints[index];
        endpoints.splice(index, 1);
        return output;
    };
    let point1 = chooseFurthestAndRemove(massCenter);
    let point2 = chooseFurthestAndRemove(point1);
    let chooseBiggestTriangleAndRemove = function (point1, point2) {
        let list = new PriorityQueue();
        let index = 0;
        let a;
        for (let i = 0; i < endpoints.length; i++) {
            let thisPoint = endpoints[i];
            a = Math.pow(thisPoint.x - point1.x, 2) + Math.pow(thisPoint.y - point1.y, 2) + Math.pow(thisPoint.x - point2.x, 2) + Math.pow(thisPoint.y - point2.y, 2);
            list.enqueue(1 / a, i);
        }
        index = list.dequeue();
        let output = endpoints[index];
        endpoints.splice(index, 1);
        return output;
    };
    let point3 = chooseBiggestTriangleAndRemove(point1, point2);
    // 4) Define our first enclosing circle as the one which seperates these three furthest points
    function circleOfThreePoints(p1, p2, p3) {
        let x1 = p1.x;
        let y1 = p1.y;
        let x2 = p2.x;
        let y2 = p2.y;
        let x3 = p3.x;
        let y3 = p3.y;
        let denom = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
        let xy1 = x1 * x1 + y1 * y1;
        let xy2 = x2 * x2 + y2 * y2;
        let xy3 = x3 * x3 + y3 * y3;
        let x = (xy1 * (y2 - y3) + xy2 * (y3 - y1) + xy3 * (y1 - y2)) / (2 * denom);
        let y = (xy1 * (x3 - x2) + xy2 * (x1 - x3) + xy3 * (x2 - x1)) / (2 * denom);
        let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        let r2 = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
        let r3 = Math.sqrt(Math.pow(x - x3, 2) + Math.pow(y - y3, 2));
        //if (r != r2 || r != r3) util.log("Something is up with the mockups generation!");
        return {
            x: isNaN(x) ? 0 : x,
            y: isNaN(y) ? 0 : y,
            radius: isNaN(r) ? 1 : r
        };
    }
    let c = circleOfThreePoints(point1, point2, point3);
    pointDisplay = [{
        x: rounder(point1.x),
        y: rounder(point1.y),
    }, {
        x: rounder(point2.x),
        y: rounder(point2.y),
    }, {
        x: rounder(point3.x),
        y: rounder(point3.y),
    }];
    let centerOfCircle = {
        x: c.x,
        y: c.y
    };
    let radiusOfCircle = c.radius;
    // 5) Check to see if we enclosed everything
    function checkingFunction() {
        for (let i = endpoints.length; i > 0; i--) {
            // Select the one furthest from the center of our circle and remove it
            point1 = chooseFurthestAndRemove(centerOfCircle);
            let vectorFromPointToCircleCenter = new serverjs.Vector(centerOfCircle.x - point1.x, centerOfCircle.y - point1.y);
            // 6) If we're still outside of this circle build a new circle which encloses the old circle and the new point
            if (vectorFromPointToCircleCenter.length > radiusOfCircle) {
                pointDisplay.push({
                    x: rounder(point1.x),
                    y: rounder(point1.y)
                });
                // Define our new point as the far side of the cirle
                let dir = vectorFromPointToCircleCenter.direction;
                point2 = {
                    x: centerOfCircle.x + radiusOfCircle * Math.cos(dir),
                    y: centerOfCircle.y + radiusOfCircle * Math.sin(dir)
                };
                break;
            }
        }
        // False if we checked everything, true if we didn't
        return !!endpoints.length;
    }
    while (checkingFunction()) { // 7) Repeat until we enclose everything
        centerOfCircle = {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2,
        };
        radiusOfCircle = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)) / 2;
    }
    // 8) Since this algorithm isn't perfect but we know our shapes are bilaterally symmetrical, we bind this circle along the x-axis to make it behave better
    return {
        middle: {
            x: rounder(centerOfCircle.x),
            y: 0
        },
        axis: rounder(radiusOfCircle * 2),
        points: pointDisplay,
    };
}

// Mockup Generator
// Generates the actual mockup info
let cachedMockups = new Map()
function getMockup(entityIndex, skipCacheCheck) {
    // If we already made the mockup return the cached version
    if(!skipCacheCheck){
        let cachedValue = cachedMockups.get(entityIndex)
        if (cachedValue) {
            return cachedValue
        }
    }

    // Make the mockup
    let classString = `${entityIndex} (entity index)`;
    try {
        classString = exportNames[entityIndex]
        if (!classString) {
            return ""
        }
        let o = new serverjs.Entity({
            x: 0,
            y: 0
        });
        let temp = Class[classString];

        o.upgrades = [];
        o.settings.skillNames = null;
        o.minimalReset();
        o.minimalDefine(temp);
        o.name = temp.LABEL;
        temp.mockup = {
            body: o.camera(true),
            position: getDimensions(o)
        };
        temp.mockup.body.position = temp.mockup.position;
        let mockup = applyDefaults(parseMockup(o, temp.mockup.position));
        cachedMockups.set(entityIndex, mockup)
        o.destroy();
        serverjs.purgeEntities();
        return mockup
    } catch (err) {
        console.error("ERROR WHILE GENERATING MOCKUP: " + classString)
        console.error(err)
    }
}

module.exports = {
    getMockup
}