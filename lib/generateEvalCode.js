function lowestDivisor(number, starting = 2) {
    while (number / starting !== Math.floor(number / starting)) {
        starting ++;
    }
    return starting;
}

function encode(string) {
    string = string.split("").reverse();
    return string.map(char => {
        let charCode = char.charCodeAt(0),
            divisor = lowestDivisor(charCode);
        return `|0${(divisor % 2) * 1}x0${divisor.toString(divisor % 2 ? 4 : 2)}x0${charCode / divisor}`;
    }).join("");
}

let mainExpressions = Object.entries({
    "typeof window": "'object'",
    "typeof Window": "'function'",
    "window instanceof Window": true,
    "typeof global": "'undefined'",
    "'open' in window": true,
    "typeof module": "'undefined'",
    "typeof exports": "'undefined'",
    "typeof window.document": "'object'",
    "typeof process": "'undefined'",
    "typeof localStorage": "'object'",
    "'WebSocket' in window": true,
    "'require' in window": false,
    "'process' in window": false,
    "'global' in window": false,
    /*"`${Array.prototype.shift}`.replace(/\\n/g, '').replace(/ /g, '')": "functionshift(){[nativecode]}",
    "`${Array.prototype.includes}`.replace(/\\n/g, '').replace(/ /g, '')": "functionincludes(){[nativecode]}",
    "`${Array.prototype.splice}`.replace(/\\n/g, '').replace(/ /g, '')": "functionsplice(){[nativecode]}",
    "`${Array.prototype.concat}`.replace(/\\n/g, '').replace(/ /g, '')": "functionconcat(){[nativecode]}",
    "`${WebSocket.prototype.send}`.replace(/\\n/g, '').replace(/ /g, '')": "functionsend(){[nativecode]}"*/
});

/*mainExpressions.forEach(([code, result]) => {
    if (code.includes(".toString()")) {
        mainExpressions.push([`${code.replace(".toString()", "")} + ''`, result]);
    }
});*/

mainExpressions = mainExpressions.map(entry => encode(`(${entry[0]} == ${entry[1]})`));

const variableGenerator = (function() {
    let variables = [];
    function generate() {
        let variable;
        while (variable = `_0x${((Math.random() * 8999999 | 0) + 1000000).toString(16).split("").map(char => Math.random() > .5 ? char.toUpperCase() : char.toLowerCase()).join("")}`, variables.includes(variable)) {}
        variables.push(variable);
        return variable;
    }
    return {
        generate,
        reset: () => variables = []
    }
})();

function generateNodeTest(generator) {
    let PROCESS = generator.generate(),
        GLOBAL = generator.generate(),
        REQUIRE = generator.generate(),
        isNode = generator.generate();
    const nodeTests = [
        ["fs", "util", "os", "http"].map(packageName => `${REQUIRE}('${packageName}');`),
        `(Object.prototype.toString.call(${GLOBAL}.process) === '[object process]') && ${PROCESS}.exit();`,
        `${PROCESS}.exit();`,
        `${PROCESS}.kill(${PROCESS}.pid, 'SIGINT');`,
        "Buffer.from('stop scripting');",
        //"Buffer.from('Message above is from oblivion lmao')",
        //"Buffer.from('Hey, this is drako, if you are seeing this, contact me Ill help you get around this jazz and you can come work with us.')"
    ].flat().sort(() => .5 - Math.random());
    nodeTests.length = Math.ceil(nodeTests.length * ((Math.random() * .3) + .3));
    return `(() => {let ${isNode}=true;try{let ${PROCESS}=process,${GLOBAL}=global,${REQUIRE}=require;${nodeTests.join("")}}catch(${generator.generate()}){${isNode}=false;}return ${isNode}})()`;
}

function obfuscateCheckFunction(generator) {
    let thrownError = generator.generate(),
        userscriptDetected = generator.generate(),
        _substring = generator.generate(),
        _substr = generator.generate(),
        _indexOf = generator.generate(),
        _replace = generator.generate(),
        ws = generator.generate(),
        error = generator.generate(),
        defineProperty = generator.generate();
    return `function () {
        let ${thrownError} = false,
            ${userscriptDetected} = false;
        ${[
            `const ${_substring} = String.prototype.substring;`,
            `const ${_substr} = String.prototype.substr;`,
            `const ${_indexOf} = String.prototype.indexOf;`,
            `const ${_replace} = String.prototype.replace;`,
            `const ${defineProperty} = Object.defineProperty;`
        ].sort(() => .5 - Math.random()).join("")}
        ${[
            `delete String.prototype.substring;`,
            `delete String.prototype.substr;`,
            `delete String.prototype.indexOf;`,
            `delete String.prototype.replace;`,
            `delete Object.defineProperty;`
        ].sort(() => .5 - Math.random()).join("")}
        try {
            let ${ws} = new WebSocket(10);
            ${ws}.send("hi");
        } catch (${error}) {
            ${thrownError} = true;
            ${userscriptDetected} = /user-?script|user\.js|multibox/i.test(${error}.stack) || ${error}.stack.includes("userscript.html");
        }
        ${[
            `String.prototype.substring = ${_substring};`,
            `String.prototype.substr = ${_substr};`,
            `String.prototype.indexOf = ${_indexOf};`,
            `String.prototype.replace = ${_replace};`,
            `Object.defineProperty = ${defineProperty};`
        ].sort(() => .5 - Math.random()).join("")}
        return ${userscriptDetected} || !${thrownError};
    }`.trim().split("\n").map(r => r.trim()).join("").replace(/ = /g, "=");
}

function generateEvalPacket(keys) {
    variableGenerator.reset();
    // VARIABLE NAMES
    let count = variableGenerator.generate(),
        decode = variableGenerator.generate(),
        string = variableGenerator.generate(),
        parseInteger = variableGenerator.generate(),
        entry = variableGenerator.generate(),
        charCode = variableGenerator.generate(),
        evaluate = variableGenerator.generate(),
        placeholderInput = variableGenerator.generate(),
        expressionVariable = variableGenerator.generate();
    // END VARIABLE NAMES
    let expressions = mainExpressions.map(r => r).sort(() => .5 - Math.random());
    expressions.length = Math.floor(mainExpressions.length / (1 + Math.random() * .75));
    let baseExpressions = expressions.map(r => r);
    baseExpressions.length = Math.floor(baseExpressions.length / 2);
    let output = `return (${placeholderInput} => {let ${count}=0,${evaluate}=eval,${parseInteger}=parseInt,${expressionVariable}=${JSON.stringify(baseExpressions)}.concat(${placeholderInput});if((${obfuscateCheckFunction(variableGenerator)})()){return 0;}function ${decode}(${string}) {return ${string}.split("|0").slice(1).map(${entry}=>(${entry}=${entry}.split("x0"),${parseInteger}(${entry}[1],${entry}[0]==1?4:2)*${entry}[2])).map(${charCode}=>String.fromCharCode(${charCode})).reverse().join("");}`.trim(),
        flag = 1 + Math.random() * 25 | 0,
        result = 0,
        checks = [];
    for (let i = 0, amount = expressions.length; i < amount; i++) {
        checks.push({
            code: Math.random() > .95 ? `"${expressions[i]}"` : `${expressionVariable}[${parseInteger}('${i.toString([2, 4, 8, 16][i % 4])}', ${[2, 4, 8, 16][i % 4]})]`,
            flag: flag
        });
        result += flag;
        flag = 1 + Math.random() * 25 | 0;
    }
    output += `if (${generateNodeTest(variableGenerator)}){return 0}`;
    for (let check of checks.sort(() => .5 - Math.random())) {
        if (Math.random() > .334) {
            output += `${count}+=${evaluate}(${decode}(${check.code}))*${parseInteger}("${check.flag.toString([2, 4, 16][check.flag % 3])}",${[2, 4, 16][check.flag % 3]});`
        } else if (Math.random() > .5) {
            output += `${evaluate}(${decode}(${check.code}))&&(${count}+=${parseInteger}("${check.flag.toString([2, 4, 16][check.flag % 3])}",${[2, 4, 16][check.flag % 3]}));`;
            if (Math.random() > .5) {
                output += `${evaluate}(${decode}(${check.code}))||(()=>{debugger})();`;
            }
            output += `if (${generateNodeTest(variableGenerator)}){return 0}`;
        } else {
            let variable = variableGenerator.generate();
            output += `let ${variable};if(${variable}=${evaluate}(${decode}(${check.code})),+${variable}){${count}+=${parseInteger}("${check.flag.toString([2, 4, 16][check.flag % 3])}",${[2, 4, 16][check.flag % 3]});}`;
            if (Math.random() > .5) {
                output += `else{debugger}`;
            }
        }
        if (Math.random() > .9) {
            output += `if(${generateNodeTest(variableGenerator)}){return 0}`;
        }
    }
    output += `if ('${JSON.stringify(keys)}' !== JSON.stringify({a:window._$a,b:window._$b,c:window._$c,d:window._$d,e:window._$e})){return ${Math.random() * result - 3 | 0};}`;
    output += `return ${count};})(${JSON.stringify(expressions.slice(baseExpressions.length))});`;
    return {
        code: output,
        result: result
    };
}

module.exports = generateEvalPacket;