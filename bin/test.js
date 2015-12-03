// Source: https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
var Mocha = require('mocha'),
    fs = require('fs'),
    resolve = require('path').resolve,
    join = require('path').join;

// get library path
var lib = resolve(__dirname, '../lib/');

// Instantiate a Mocha instance.
var mocha = new Mocha({
    ui: 'tdd'
});

function add_module(mod_path) {
    var dirName = join(mod_path, 'test');

    // ensure path has test folder
    if (!fs.existsSync(dirName)) return;

    // Add each .js file to mocha
    fs.readdirSync(dirName).filter(function(file){
        // Only keep the .js files
        return file.substr(-3) === '.js';
    }).forEach(function(file){
        console.log('Adding', file)
        mocha.addFile(
            join(dirName, file)
        );
    });
}

fs.readdirSync(lib)
    .forEach(function(mod) {
        mod_path = join(lib, mod)
        add_module(mod_path)
    });

// Add app (root) tests
var root = resolve(__dirname, '../');
add_module(root);

// Run the tests
mocha.run(function(failures){
    process.on('exit', function () {
        process.exit(failures);
    });
});
