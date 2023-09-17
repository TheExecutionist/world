/*jslint node: true */
"use strict";

// Seed math

exports.random = x => {
    return x * Math.random();
};

exports.randomAngle = () => {
    return Math.PI * 2 * Math.random();
};

exports.randomRange = (min, max) => {
    return Math.random() * (max - min) + min;
};
exports.biasedRandomRange = (min, max, bias) => {
    let mix = Math.random() * bias;
    return exports.randomRange(min, max) * (1 - mix) + max * mix;
}

exports.irandom = i => {
    let max = Math.floor(i);
    return Math.floor(Math.random() * (max + 1)); //Inclusive
};

exports.irandomRange = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Inclusive
};

exports.gauss = (mean, deviation) => {
    let x1, x2, w;
    let i = 5;
    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        w = x1 * x1 + x2 * x2;
        i--;
    } while ((0 == w || w >= 1) && i > 0);

    w = Math.sqrt(-2 * Math.log(w) / w);
    return mean + deviation * x1 * w;
};

exports.gaussInverse = (min, max, clustering) => {
    let range = max - min;
    let output = exports.gauss(0, range / clustering);
    let i = 3;
    while (output < 0 && i > 0) {
        output += range;
        i--;
    }
    i = 3;
    while (output > range && i > 0) {
        output -= range;
        i--;
    }

    return output + min;
};

exports.gaussRing = (radius, clustering) => {
    let r = exports.random(Math.PI * 2);
    let d = exports.gauss(radius, radius * clustering);
    return {
        x: d * Math.cos(r),
        y: d * Math.sin(r),
    };
};

exports.chance = prob => {
    return exports.random(1) < prob;
};

exports.dice = sides => {
    return exports.random(sides) < 1;
};

exports.choose = arr => {
    return arr[exports.irandom(arr.length - 1)];
};

exports.chooseN = (arr, n) => {
    let o = [];
    for (let i = 0; i < n; i++) {
        o.push(arr.splice(exports.irandom(arr.length - 1), 1)[0]);
    }
    return o;
};

exports.chooseChance = (...arg) => {
    let totalProb = 0;
    arg.forEach(function (value) { totalProb += value; });
    let answer = exports.random(totalProb);
    for (let i = 0; i < arg.length; i++) {
        if (answer < arg[i]) return i;
        answer -= arg[i];
    }
};

exports.fy = (a,b,c,d) => {
    c = a.length;
    while (c) {
        b = Math.random() * (--c + 1) | 0;
        d = a[c];
        a[c] = a[b];
        a[b] = d;
    }
};

const names = (require("fs").readFileSync('./lib/names.txt', { encoding:'utf8', flag:'r' })).split(/\r?\n/);
exports.chooseBotName = (function () {
    let q = [];
    return () => {
        if (!q.length) {
            exports.fy(names);
            q = [...names];
        };
        return q.shift();
    };
})()

exports.chooseBossName = (code, n) => {
    switch (code) {
        case 'a':
            return exports.chooseN([
                "Archimedes",
                "Akilina",
                "Anastasios",
                "Athena",
                "Alkaios",
                "Amyntas",
                "Aniketos",
                "Artemis",
                "Anaxagoras",
                "Apollo",
                "Pewdiepie",
                "Ares",
                "Helios",
                "Hades",
                "Alastor",
                "Bruh Moment",
                "Shrek",
                "Geofridus",
                "Guillermo",
                "Tephania",
                "Christaire",
                "Galileo",
                "Newton",
                "Herschel",
                "Eratosthenes",
                "Maxwell",
                "Lavoisier",
                "Maynard"
            ], n);
        case 'sassafras':
            return exports.chooseN([
                "Sassafras",
                "Sassafras",
                "Hemisphere"
            ], n);
        case 'castle':
            return exports.chooseN([
                "Berezhany",
                "Lutsk",
                "Dobromyl",
                "Akkerman",
                "Palanok",
                "Zolochiv",
                "Palanok",
                "Mangup",
                "Olseko",
                "Brody",
                "Isiaslav",
                "Kaffa",
                "Bilhorod",
                "Cheese Block",
                "Ganondorf",
                "Weiss",
                "Spiegel",
                "Hasselhoff",
                "Konstanze",
                "Callum",
                "Maleficum",
                "Droukar",
                "Astradhur",
                "Saulazar",
                "Gervaise",
                "Reimund",
                "Nothing",
                "Kohntarkosz"
            ], n);
        case 'all':
            return exports.chooseN([
                "Archimedes",
                "Akilina",
                "Anastasios",
                "Athena",
                "Alkaios",
                "Amyntas",
                "Aniketos",
                "Artemis",
                "Anaxagoras",
                "Apollo",
                "Pewdiepie",
                "Ares",
                "Helios",
                "Hades",
                "Alastor",
                "Bruh Moment",
                "Shrek",
                "Geofridus",
                "Guillermo",
                "Tephania",
                "Christaire",
                "Galileo",
                "Newton",
                "Herschel",
                "Eratosthenes",
                "Maxwell",
                "Lavoisier",
                "Maynard",
                "Berezhany",
                "Lutsk",
                "Dobromyl",
                "Akkerman",
                "Palanok",
                "Zolochiv",
                "Palanok",
                "Mangup",
                "Olseko",
                "Brody",
                "Isiaslav",
                "Kaffa",
                "Bilhorod",
                "Cheese Block",
                "Ganondorf",
                "Weiss",
                "Spiegel",
                "Hasselhoff",
                "Konstanze",
                "Callum",
                "Maleficum",
                "Droukar",
                "Astradhur",
                "Saulazar",
                "Gervaise",
                "Reimund",
                "Nothing",
                "Kohntarkosz"
            ], n);
        default: return ['God'];
    }
};

exports.randomLore = function() {
    return exports.choose([
        "3 + 9 = 4 * 3 = 12",
        "You are inside of a time loop.",
        "There are six major wars.",
        "You are inside of the 6th major war.",
        "AWP-39 was re-assembled into the Redistributor.",
        "The world quakes when the Destroyers assemble.",
        "Certain polygons can pull you away from the world you know."
        /*
        "The Redistributor evolved from AWP-39.",
        "The egg came first.",
        "You're inside of a time loop.",
        "The first Guardian, Summoner, and Defender have been fused together.",
        "Crashers were invented to capture tank-based weaponry.",
        "Comet was originally on the side of tanks due to it having a circular body.",
        "Dominators are AC's disguised as pets.",
        "Xyv's real name is The Implosionist.",
        "Comet was originally brown.",
        "The first egg evolved into an Alpha Pentagon, which then populated the arena with new polygons.",
        "The first egg evolved into an Alpha Pentagon, which later became the first Leviathan.",
        "There are 6 major wars in the Arras world.",
        "The 'Brown Team' disappeared suddendly, then came back with futuristic ideas, before being seemingly wiped out.",
        "You are inside of the 6th major war.",
        "Fallen Tanks came from the 2nd war.",
        "The Fallen Booster spins. Not because it wants to team, but because it wants to remember the days that it did team.",
        "The Fallen Overlord was tortured by a Guardian into shooting crashers. Both the crashers and the Overlord are fallen.",
        "Oxyrrhexis was originally made to shoot Green Guardians, and it sometimes still can.",
        "Look out for boss broadcasts. 'A' means more than one. 'The' means the original, or the first.",
        "The first Destroyer eventually evolved to become the Arena Closers we all know and love.",
        "Green Polygons were made to ward off tanks, but were accidentally fitted with more XP.",
        "Orange Polygons were made by the Comet to help out tanks, back when the Comet was on the side of the tanks.",
        "The Arena Closers are always running towards you. You just witnessed the AC Alarm.",
        "The AC Alarm was invented by the first Streamliner.",
        "Golden Nonagons may still evolve.",
        "Arena Closers are yellow because of the Summoner.",
        "Xyv's extra side comes from its instability.",
        "Polygons aren't evil.",
        "Tanks aren't evil.",
        "The Hemispheres indirectly caused the time loop.",
        "Beware the Hemispheres.",
        "The evolution from polygons to tanks causes them to get larger. The same happens inversely.",
        "The first Destroyer was extremely close to polygons, and therefore tried to evolve like a polygon.",
        "The 1st major war was caused by tanks following in the steps of the first Destroyer.",
        "The Summoner did not kill the first Destroyer, as most tanks believe. The Destroyer was forced out due to being a nuicance.",
        "The time loop stops the formation of 'The Perfect Sphere.'",
        "The 1st war convinced the Comet that the tanks were in the right, since he believed that the Summoner killed first.",
        "The Comet was colored brown since the Brown Team was the biggest force in the 1st war.",
        "The 1st war ended with the formation of The Implosionist Project.",
        "The 'Tank A' project was made by an unknown faction to clone tanks during the 1st war.",
        "Disputes over the Tank A project caused the 2nd war.",
        "Xyv is not a living thing by itself. It is inhabited by the original 3 boss polygons.",
        "The Hemispheres fight against the tanks behind 'Tank A'.",
        "Polygons had gained more energy after the first war, causing them to evolve into Hexagons, and other polygons.",
        "Polygons are more tightly packed together for protection, able to split and swarm if shot at.",
        "The polygons won the first war.",
        "Tanks, after the first war, are no longer able to 'evolve' like polygons.",
        "Tanks that are created by the 'Tank A' project seem to be extremely precice. Now they're everywhere, even outnumbering normal tanks.",
        "Most Tanks are still in hatred over Tank A tanks to this day, despite tanks from the Tank A project are in the same teams as other tanks.",
        "Orange polygons were meant to be brown. The reason why is up for debate.",
        "Dominators were made during the third war. Their job was to protect bases.",
        "Only one Dominator now protects bases. The others were set free by the a rag-tag time traveling group of brown tanks.",
        "Rocket Falls was an arena where only the first tanks ever created were allowed. They were generally free of wars until the 4th war.",
        "Most tanks were made by the 3rd war, described as 3rd Gen tanks.",
        "Sheba was signed and Shiva was abolished at Rocket Falls.",
        "No individual tank has a story behind it, but individual entities do.",
        "Mladic was the general of the polygons.",
        "Mladic was a pink triangle who lead the polygons towards victory during the 3rd and 4th wars.",
        "Most Crashers and Bosses are modeled after Mladic.",
        "Mladic disappeared as soon as the 5th war began.",
        "'3 + 9 = 4 * 3 = 12' is a mathematical phrase inscribed into AWP-39 and Redistributor. Nobody knows what it means.",
        "The 5th war was the shortest.",
        "'mf=r' is a phrase uttered by Hemispheres.",
        "The Comet is a Hemisphere.",
        "Wocks was a tank general during the 3rd and 4th wars, who was eventually captured and converted into an Oxyrrhexis by Polygons.",
        "Tank A was phased out after the 4th war, but came back after the anarchy that came from the 5th war.",
        "Think about who's telling you this information.",
        "Rocket Falls is the only place that is still in anarchy, without teams of any kind."*/
    ]);
}