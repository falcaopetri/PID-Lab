/*
    Modified from: https://strongloop.com/strongblog/modular-node-js-express
    "This script simply visits every component and runs npm test.
     When we run npm test in the project root,
     all the components get tested"
*/
var fs = require('fs');
var resolve = require('path').resolve;
var join = require('path').join;
var cp = require('child_process');

// get library path
var lib = resolve(__dirname, '../lib/');

fs.readdirSync(lib)
    .forEach(function(mod) {
        var modPath = join(lib, mod);

        // ensure path has test folder
        if (!fs.existsSync(join(modPath, 'test/'))) return;

        // execute test
        cp.spawn('npm', ['test'], {
            env: process.env,
            cwd: modPath,
            stdio: 'inherit'
        });
    });
