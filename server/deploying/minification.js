const fs = require("fs")

let code = fs.readFileSync("./client/app.js").toString();
console.log("Starting Uglify Minification process...");

const uglify = require("uglify-js");

let result = uglify.minify(code, {
    parse: {
        bare_returns: false,
        expression: false,
        filename: null,
        html5_comments: true,
        shebang: true,
        strict: false,
        toplevel: null
    },
    compress: {
        arrows: true,
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        conditionals: true,
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
        evaluate: true,
        expression: false,
        global_defs: {},
        hoist_funs: false,
        hoist_props: true,
        hoist_vars: false,
        if_return: true,
        inline: true,
        join_vars: true,
        keep_fargs: true,
        keep_fnames: false,
        keep_infinity: false,
        loops: true,
        negate_iife: true,
        passes: 1,
        properties: true,
        pure_getters: "strict",
        pure_funcs: null,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        switches: true,
        top_retain: null,
        toplevel: false,
        typeofs: true,
        unsafe: false,
        unsafe_comps: false,
        unsafe_Function: false,
        unsafe_math: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
        unused: true,
    },
    mangle: {
        eval: true,
        keep_fnames: false,
        properties: {
            keep_quoted: true,
            reserved: JSON.parse(fs.readFileSync("./client/public/json/reserved.json").toString()),
            regex: /^_/
        },
        toplevel: false
    },
    output: {
        ascii_only: false,
        beautify: false,
        comments: /@license|@preserve|^!/,
        indent_level: 4,
        indent_start: 0,
        inline_script: true,
        keep_quoted_props: false,
        max_line_len: false,
        preamble: null,
        preserve_line: false,
        quote_keys: false,
        quote_style: 0,
        semicolons: true,
        shebang: true,
        source_map: null,
        webkit: false,
        width: 80,
        wrap_iife: false
    },
    wrap: false
})
/*let result = uglify.minify(code, {
    compress: {
        dead_code: true,
    },
    mangle: {
        eval: true,
        toplevel: false,
        properties: {
            keep_quoted: true,
            reserved: JSON.parse(fs.readFileSync("./client/public/json/reserved.json").toString()),
            regex: /^_/
        }
    },
    output: {
        wrap_iife: true,
    },
    nameCache: null,
    toplevel: false,
    warnings: true,
});*/
if (result.error) throw result.error;
console.log("Uglify process complete.");
// Intentional
console.log("Starting Obfuscation process...");
code = result.code;
let JavaScriptObfuscator = require('javascript-obfuscator');
result = JavaScriptObfuscator.obfuscate(result.code, {
    compact: true,
    controlFlowFlattening: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: false,
    renameGlobals: true,
    selfDefending: true,
    simplify: true,
    splitStrings: false,
    stringArray: true,
    stringArrayCallsTransform: false,
    stringArrayEncoding: [],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false,
    domainLock: ["localhost", "", "beta.woomy.app", "woomy.app", "woomy-arras.netlify.app", "woomy-arras.xyz", "www.woomy-arras.xyz", "development.woomy-arras.xyz"],
    domainLockRedirectUrl: "woomy.app",
    debugProtection: false,
    debugProtectionInterval: 4000,
});
console.log("Obfuscation complete.");
console.log()
let string = `// Production code produced on ${new Date().toLocaleString().split(',')[0]}\n// Remember kids, scripting is bannable!\n\n !function () {${result}}()`;
fs.writeFileSync("./client/public/js/min.app.js", string, (error => {
    throw error;
}));
