/**
 * Created by guy.kaufman on 25/03/2017.
 */


define(['chai', 'sinon', 'src/anyLogger'], function(chai, sinon, logger) {
    describe('AnyLogger Test', function() {

        var expect = chai.expect;

		describe('test logger instance', function() {
			it('logger instance should exist', function(){
				var loggerInst;
				loggerInst = logger.create();
				expect(loggerInst != undefined).to.equal(true);
			});
            it('getLoggerById', function(){
                var loggerInst;
                loggerInst = logger.create({id:'myLogger'});
                expect(logger.getLoggerById('myLogger') === loggerInst).to.equal(true);
            });
		});

		describe('test logger logLevel', function() {
			it('logLevel should return log level name', function(){
				var loggerInst;
				loggerInst = logger.create();
				expect(typeof loggerInst.logLevel() === 'string').to.equal(true);
			});
			it('logLevel should return default log level when the input is wrong', function(){
				var loggerInst;
				loggerInst = logger.create();
				expect(loggerInst.logLevel({}) === 'OFF').to.equal(true);
			});
			it('logLevel should set log level by name and return its name', function(){
				var loggerInst;
				loggerInst = logger.create();
				expect(loggerInst.logLevel('DEBUG') === 'DEBUG').to.equal(true);
			});
			it('logLevel should set log level by object and return its name', function(){
				var loggerInst;
				loggerInst = logger.create();
				expect(loggerInst.logLevel(logger.consts.logLevels.DEBUG) === 'DEBUG').to.equal(true);
			});

		});

		describe('test logger default constructor', function() {
			it('log level should equal to the default log level', function(){
				var loggerInst;
				loggerInst = logger.create();
				expect(loggerInst.logLevel() === logger.consts.defaultLogLevel.name).to.equal(true);
			});
			it('handlers should include console type', function(){
				var loggerInst;
				loggerInst = logger.create();
				expect(loggerInst.handlers.some(function(handler){if (handler.type === 'console') return true;})).to.equal(true);
			});
			it('formatter should be default', function(){
				var loggerInst;
				loggerInst = logger.create();
				var message = 'world';
				message = loggerInst.formatter(message, {module: 'hello'})
				expect(message).to.equal('[hello]world');
			});

		});

		describe('test logger config constructor', function() {
			it('log level should equal to INFO', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'INFO'
				});
				expect(loggerInst.logLevel() === logger.consts.logLevels.INFO.name).to.equal(true);
			});
			it('log module should be loggerName', function(){
				var loggerInst;
				loggerInst = logger.create({
					module: 'loggerName'
				});
				expect(loggerInst.settings.module === 'loggerName').to.equal(true);
			});
			it('log level should equal to WARN when not uppercase', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'warn'
				});
				expect(loggerInst.logLevel() === logger.consts.logLevels.WARN.name).to.equal(true);
			});
			it('logToConsole:false + useFormatter:false : handlers and formatter should be empty', function(){
				var loggerInst;
				loggerInst = logger.create({
					logToConsole: false,
					useFormatter: false
				});
				expect(loggerInst.handlers.length === 0 && !loggerInst.formatter ).to.equal(true);
			});
			it('configure custom formatter, handler should remain', function(){
				var loggerInst;
				loggerInst = logger.create({
					formatter: function(){return 'hello'}
				});
				var message = 'world';
				message = loggerInst.formatter(message, {module: 'hello'})
				expect(message).to.equal('hello');
				expect(loggerInst.handlers.some(function(handler){if (handler.type === 'console') return true;})).to.equal(true);
			});
			it('configure formatter and handler', function(){
				var loggerInst;
				loggerInst = logger.create({
					formatter: function(){return 'hello'},
					handlers: [function(){}]
				});
				var message = 'world';
				message = loggerInst.formatter(message, {module: 'hello'})
				expect(message).to.equal('hello');
				expect(loggerInst.handlers.some(function(handler){if (handler.type === 'custom') return true;})).to.equal(true);
			});
		});

        describe('test console logging', function() {
			var storeDebug = [];
			var storeWarn = [];
            before(function(){
				var oldDebug= console.debug;
				console.debug = function(str){
					storeDebug.push(str);
					oldDebug.apply(console, arguments);
				}
				var oldWarn = console.warn;
				console.warn = function(str){
					storeWarn.push(str);
					oldWarn.apply(console, arguments);
				}
            });
            it('logger should log in debug level "hello world" to the console', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'debug'
				});
				loggerInst.debug('hello world');
                expect(storeDebug.indexOf('hello world') > -1).to.equal(true);
            });
			it('logger should log with scope in debug level "[scopeWorld]hello" to the console', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'debug'
				});
				loggerInst.debug('hello', {scope:'scopeWorld'});
				expect(storeDebug.indexOf('[scopeWorld]hello') > -1).to.equal(true);
			});
			it('logger should log in warn level with formatter "[hello]world" to the console', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'warn',
					module: 'hello'
				});
				loggerInst.warn('world');
				expect(storeWarn.indexOf('[hello]world') > -1).to.equal(true);
			});
			it('logger should not log in warn level when trying to log debug', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'warn',
				});
				loggerInst.debug('noLog');
				expect(storeWarn.indexOf('noLog') === -1).to.equal(true);
			});
			it('log when configured formatter and handler', function(){
				var loggerInst;
				loggerInst = logger.create({
					formatter: function(message, data){return message + '!' + data.module},
					handlers: [function(message, level){console.debug(message)}],
					module: 'custom',
					logLevel: 'debug',
				});
				loggerInst.warn('hello world');
				expect(storeWarn.indexOf('hello world ! custom') === -1).to.equal(true);
				expect(storeDebug.indexOf('hello world ! custom') === -1).to.equal(true);
			});


        });

		describe('test capture console logs', function() {
            it('dont collect logs twice', function(){
                var loggerInst;
                loggerInst = logger.create({
                    logLevel: 'debug',
                    collectConsoleLogs: true,
                    captureLogs: true
                });
                loggerInst.error('hello world');
                expect(loggerInst.getCapturedLogs().length).to.equal(1);
            });
            it('capture logs limit', function(){
                var loggerInst;
                loggerInst = logger.create({
                    logLevel: 'debug',
                    collectConsoleLogs: true,
                    captureLogs: true,
					captureLogsLimit: 2
                });
                expect(loggerInst.getCapturedLogs().length).to.equal(0);
                console.debug('hello world');
                expect(loggerInst.getCapturedLogs().length).to.equal(1);
                loggerInst.error('hello world');
                expect(loggerInst.getCapturedLogs().length).to.equal(1);
                loggerInst.captureLogsLimit(3);
                loggerInst.debug('hello world');
                expect(loggerInst.getCapturedLogs().length).to.equal(2);
            });
			it('captureLogs + collectConsoleLogs + getCapturedLogs + flushCapturedLogs', function(done){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'debug',
					collectConsoleLogs: true,
					captureLogs: true
				});
				console.debug('hello world');
				console.log('hello world');
				console.info('hello world');
				console.warn('hello world');
				console.error('hello world');
                loggerInst.error('hello world');
				expect(loggerInst.getCapturedLogs()[0].message === 'hello world').to.equal(true);
				expect(loggerInst.getCapturedLogs()[1].message === 'hello world').to.equal(true);
				expect(loggerInst.getCapturedLogs()[2].message === 'hello world').to.equal(true);
				expect(loggerInst.getCapturedLogs()[3].message === 'hello world').to.equal(true);
				expect(loggerInst.getCapturedLogs()[4].message === 'hello world').to.equal(true);
               	loggerInst.flushCapturedLogs( 'error' ,['console', 'html'],function(count){
                   expect(count).to.equal(2);
                   expect(loggerInst.getCapturedLogs().length).to.equal(0);
                   done();
			   	});
			});
            it('flushCapturedLogsOnLimit', function(){
                var loggerInst;
                loggerInst = logger.create({
                    logLevel: 'debug',
                    flushCapturedLogsOnLimit: {handlerTypes:['console'], logLevel: 'info'},
                    captureLogs: true,
                    captureLogsLimit: 3
                });
                loggerInst.debug('hello world');
                loggerInst.info('hello world');
                expect(loggerInst.getCapturedLogs().length).to.equal(2);
                loggerInst.error('hello world');
                expect(loggerInst.getCapturedLogs().length).to.equal(0);

            });
		});


		describe('test html logging ', function() {
			var testContainer = document.getElementById('testContainer');
			beforeEach(function(done){
				testContainer.innerHTML = '';
				done();
			});
			it('logger should log in debug level "hello world" to HTML', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'debug',
					logToConsole: false,
					module: 'custom',
					logToHtml: {container: testContainer},
				});
				loggerInst.debug('hello world', {scope: 'helloScope'});
				expect(testContainer.innerHTML.indexOf('hello world') > -1).to.equal(true);
			});
			it('logger table should sort by scope', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'debug',
					logToConsole: false,
					module: 'custom',
					logToHtml: {container: testContainer},
				});
				loggerInst.debug('hello world', {scope: 'worldScope'});
				loggerInst.debug('hello world', {scope: 'helloScope'});
				loggerInst.getHandlerByType('html').sort(3);
				expect(testContainer.getElementsByTagName('tbody')[0].rows[0].innerHTML.indexOf('helloScope') > -1).to.equal(true);
			});
			it('logger table should filter hello', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'debug',
					logToConsole: false,
					module: 'custom',
					logToHtml: {container: testContainer},
				});
				loggerInst.debug('hello', {scope: 'worldScope'});
				loggerInst.debug('world', {scope: 'helloScope'});
				loggerInst.debug('world', {scope: 'worldScope'});
				var remainedRowsCount = loggerInst.getHandlerByType('html').filter('hello');
				expect(testContainer.getElementsByTagName('tbody')[0].rows[0].innerHTML.indexOf('hello') > -1).to.equal(true);
				expect(testContainer.getElementsByTagName('tbody')[0].rows[1].innerHTML.indexOf('hello') > -1).to.equal(true);
				expect(remainedRowsCount).to.equal(2);
			});
			it('logger to HTML should clear the table', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'debug',
					logToHtml: {container: testContainer},
				});
				loggerInst.debug('hello', {scope: 'worldScope'});
				loggerInst.getHandlerByType('html').clear();
				expect(testContainer.getElementsByTagName('tbody')[0].rows.length).to.equal(0);
			});
			it('log to HTML captured console logs', function(){
				var loggerInst;
				loggerInst = logger.create({
					logLevel: 'debug',
					collectConsoleLogs: true,
					logToHtml: {container: testContainer},
				});
				console.debug('hello world');
				expect(testContainer.getElementsByTagName('tbody')[0].rows[0].innerHTML.indexOf('hello') > -1).to.equal(true);
			});
		});
        describe('test service logging ', function() {
        	before(function()
			{
                this.xhr = sinon.useFakeXMLHttpRequest();
			});
            after(function()
            {
                this.xhr.restore();
            });
            it('logger should log in debug level "hello world" to service + batchSize', function(){
                var loggerInst;
                loggerInst = logger.create({
                    logLevel: 'debug',
                    logToConsole: false,
                    module: 'custom',
                    logToService: {
                        loggingUrl: 'http://www.testlog.com',
                        batchSize: 1,
                        headers: [{"Content-Type": "application/json"}, {"Authorization": "5067b6e8-f0276"}],
                    }
                });
                loggerInst.debug('hello world', {scope: 'helloScope'});
                expect(loggerInst.getHandlerByType('service').sentCount()).to.equal(1);
                expect(loggerInst.getHandlerByType('service').rowsCount()).to.equal(0);
            });
            it('logger should log in debug level "hello world" to service + parser + timeframe', function(done){
                this.slow();
                this.timeout(6500);
                var loggerInst;
                loggerInst = logger.create({
                    logLevel: 'debug',
                    logToConsole: false,
                    module: 'custom',
                    logToService: {
                        loggingUrl: 'http://www.testlog.com',
                        timeframe: 0.1,
                        headers: [{"Content-Type": "application/json"}, {"Authorization": "5067b6e8-f0276"}],
						requestParser: function (logRows) {
							var logRowsOut = [];
							logRows.forEach(function (row) {
								logRowsOut.push({
									type: "LogRow",
									message: row.message,
									level: row.level,
									scope: row.scope,
									module: row.module
								});
							})
							return {
								"entities": [{
									"type": "Log",
									"revision": "1_0_0",
									"context": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
									"logRows": logRowsOut
								}]
							}
						}
					}
                });
                loggerInst.debug('hello world', {scope: 'helloScope'});
                expect(loggerInst.getHandlerByType('service').rowsCount()).to.equal(1);
                setTimeout(function(){
                    loggerInst.getHandlerByType('service').destroy();
                	expect(loggerInst.getHandlerByType('service').sentCount()).to.equal(1);
                    expect(loggerInst.getHandlerByType('service').rowsCount()).to.equal(0);
                	done();}, 6100);
            });
        });
    });

});
