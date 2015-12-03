// Source: https://www.npmjs.com/package/slinker

var slinker = require('slinker'),
    path = require('path');

slinker.link({
    modules: ['config', 'connection', 'pidController', 'socket'],
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
