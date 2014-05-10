// Karma configuration
module.exports = function( config )
{
	config.set(
	{
		// base path, that will be used to resolve files and exclude
		basePath: '../..',

		preprocessors:
		{
			//'app/scripts/**/*.js': 'coverage'
		},

		frameworks: [ 'jasmine' ],

		// list of files / patterns to load in the browser
		files: [],

		// list of files to exclude
		exclude: [],

		// test results reporter to use
		// possible values: dots || progress || growl
		reporters: [ 'progress'/*, 'growl', 'coverage'*/ ],

		// web server port
		port: 8080,

		// cli runner port
		runnerPort: 9100,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: [ 'Chrome', 'Firefox', 'Safari', 'Opera' ],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// report which specs are slower than 500ms
		// CLI --report-slower-than 500
		reportSlowerThan: 500,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true/*,

		coverageReporter:
		{
			type: 'html',
			dir: 'coverage/'
		}*/

	} );
};
