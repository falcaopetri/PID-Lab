/*
    Source: https://strongloop.com/strongblog/modular-node-js-express
    "This script simply visits every component and runs npm install.
     When we run npm install in the project root,
     all the components’ dependencies also get installed"
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

        // ensure path has package.json
        if (!fs.existsSync(join(modPath, 'package.json'))) return;

        // install folder
        cp.spawn('npm', ['i'], {
            env: process.env,
            cwd: modPath,
            stdio: 'inherit'
        });
    });
