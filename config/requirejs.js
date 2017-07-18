'use strict';
//require
module.exports = {
	min: {
		options: {
		    optimize: 'uglify2',
            preserveLicenseComments: false,
            baseUrl: "./src",
            dir: "./dist",
            name: "anyLoggerMax"
		}
	},
    dev: {
        options: {
            optimize: 'none',
            preserveLicenseComments: true,
            baseUrl: "./src",
            dir: "./dev",
            name: "anyLoggerMax"
        }
    }
};
