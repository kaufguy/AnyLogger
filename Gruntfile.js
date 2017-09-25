module.exports = function (grunt) {
	var options = {
        config : {
            src: 'config/*.js'
        }
    }

        // Load grunt configurations automatically
    var configs = require('load-grunt-configs')(grunt, options);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // show elapsed time at the end
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig(configs);

    grunt.registerTask('test', 'mocha_phantomjs');
    grunt.registerTask('build', [
        'requirejs:dev',
        'requirejs:min',
        'copy:docs',
        'copy:demolight',
        'copy:demomax'
    ]);
};
