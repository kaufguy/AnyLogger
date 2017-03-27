require.config({
    baseUrl: "../",
    paths: {
        chai: './node_modules/chai/chai',
    }
});

require([
	'../test/anyLogger.spec.js',
], function() {
    if (typeof mochaPhantomJS !== "undefined") { mochaPhantomJS.run(); }
    else { mocha.run(); }
});
