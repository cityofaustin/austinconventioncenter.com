'use strict';
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');

module.exports = function (grunt) {

		let sourceMaps = true,
			watchPort = 35701,
			serverPort = 9003;

	grunt.initConfig({
		sass: {
			main: {
				options: {
					// case sensitive!
					sourceMap: sourceMaps,
					implementation: sass,
					// for some reason in this project the source maps is being looked for in /dist/dist
					// giving a name fixes it
					sourceMapFilename: 'form.css.map',
					loadPath: [
						path.join(__dirname, 'node_modules')
					]
				},
				files: {
					'_site/pec_sandbox/assets/main.css': '_assets/stylesheets/main.scss',
				}
			}
		},

		'http-server': {
			dev: {
				root: path.join(__dirname, '_site/pec_sandbox/'),

				// the server port
				// can also be written as a function, e.g.
				// port: function() { return 8282; }
				port: serverPort,

				// the host ip address
				// If specified to, for example, "127.0.0.1" the server will
				// only be available on that ip.
				// Specify "0.0.0.0" to be available everywhere
				host: '0.0.0.0',

				showDir: true,
				autoIndex: true,

				// server default file extension
				ext: "html",

				// run in parallel with other tasks
				// runInBackground: true,
			}
		},

		watch: {
			sass: {
				files: ['./src/styles/*.scss'],
				tasks: ['sass'],
				options: {
					// keep from refreshing the page
					// the page does not care if a less file has changed
					livereload: false
				}
			},
			css: {
				// css module is needed for css reload
				// watch the main file. When it changes it will notify the page
				// the livereload.js file will check if this is CSS - and if so, reload
				// the stylesheet, and not the whole page
				files: ['dist/form.css']
			},
			// IMPORTANT: this options.livereload will work in the scripts
			// namespace, but then the CSS reload will not work properly
			options: {
				livereload: watchPort
			}
		},

		concurrent: {
			target: {
				tasks: ['watch', 'http-server:dev'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	//
	grunt.registerTask('build-dev', function () {

	});

	// The general task: builds, serves and watches
	grunt.registerTask('dev', function () {
		grunt.option.init({ env: 'dev' });
		grunt.task.run('sass');
		// grunt.task.run('http-server');
		grunt.task.run('concurrent:target');
	});

	// alias for server
	grunt.registerTask('serve', function () {
		grunt.task.run('http-server');
	});

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-http-server');

};
