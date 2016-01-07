// Source: https://www.npmjs.com/package/slinker

var slinker = require('slinker'),
    path = require('path');

slinker.link({
    modules: ['config', 'connection', 'pidController', 'socket', 'camStream'],
    modulesBasePath: path.join(__dirname, '../lib'),
    symlinkPrefix: '@',
    nodeModulesPath: path.join(__dirname, '../node_modules'),
    onComplete: function() {
        console.log('Yay, my modules are linked!');
    },
    onError: function(error) {
        console.log('Oh no, my modules aren\'t linked!');
    }
});

slinker.link({
    modules: ['jade-bootstrap'],
    modulesBasePath: path.join(__dirname, '../node_modules'),
    symlinkPrefix: '@',
    nodeModulesPath: path.join(__dirname, '../public'),
    onComplete: function() {
        console.log('Yay, my modules are linked!');
    },
    onError: function(error) {
        console.log('Oh no, my modules aren\'t linked!');
    }
});
