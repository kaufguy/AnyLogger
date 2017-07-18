/**
 * Created by guy.kaufman on 25/03/2017.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.AnyLogger = factory();
    }

}(this, function () {
    var loggers = {};
    var consts = {};
    var loggerCount = 0;
    var plugins = [];

    var defaultMessageFormatter = function(message, data) {
        if (data) {
            if (data.scope) {
                message = "[" + data.scope + "]" + message;
            }
            if (data.module) {
                message = "[" + data.module + "]" + message;
            }
            if (data.date) {
                message = "[" + data.date.toISOString() + "]" + message;
            }
        }
        return message;
    };

    // CreateConsoleHandler returns a window console handler object;
    var createConsoleHandler = function () {
        return {
            type: 'console',
            write: (typeof console === "undefined") ? function () { /* no console */ } :
                function (message, level) {
                    var handler;
                    if (level === consts.logLevels.WARN && console.warn) {
                        handler = console.warn;
                    } else if (level === consts.logLevels.ERROR && console.error) {
                        handler = console.error;
                    } else if (level === consts.logLevels.INFO && console.info) {
                        handler = console.info;
                    } else if (level === consts.logLevels.DEBUG && console.debug) {
                        handler = console.debug;
                    }
                    if (handler) {
                        handler.call(console, message, {noCollect: true});
                    }
                }
        };
    };

    var AnyLogger = function(config) {
        this.settings = {};
        this.handlers = [];
        this.capturedLogs = [];
        this.id = config.id;
        this.settings.captureLogsLimit = consts.defaultCaptureLogsLimit;
        var self = this;

        if (config.captureLogs)
        {
            if (config.captureLogsLimit)
            {
                this.captureLogsLimit(config.captureLogsLimit);
            };
            this.flushCapturedLogsOnLimit(config.flushCapturedLogsOnLimit);
            this.flushCapturedLogsOnError(config.flushCapturedLogsOnError);
            this.captureLogs(true);
        }
        if (config.logToConsole != false)
        {
            this.handlers.push(createConsoleHandler());
        }

        plugins.forEach(function(plugin)
        {
            plugin.create(self, config);
        });
        if (config.handlers)
        {
            config.handlers.forEach(self.addHandler.bind(self));
        }
        if (config.formatter)
        {
            this.formatter = config.formatter;
        }
        else if (config.useFormatter != false) {
            this.formatter = defaultMessageFormatter;
        }
        if (config.logLevel)
        {
            this.logLevel(config.logLevel);
        }
        else
        {
            this.logLevel(consts.defaultLogLevel);
        }
        if (config.module)
        {
            this.settings.module = config.module;
        }
        if (config.collect)
        {
            collect.call(this);
        }
    };

    var prototype = AnyLogger.prototype;

    // Changes the instance logging level and returns the logging level.
    prototype.logLevel = function (newLevel) {
        if (typeof newLevel === 'string' && newLevel.toUpperCase() in consts.logLevels) //case string as an input
        {
            this.settings.logLevel = consts.logLevels[newLevel.toUpperCase()];
        }
        else if (newLevel && newLevel.name in consts.logLevels) //case object as an input
        {
            this.settings.logLevel = consts.logLevels[newLevel.name];
        }
        return this.settings.logLevel ? this.settings.logLevel.name : null;
    };

    prototype.captureLogs = function(capture)
    {
        this.settings.captureLogs = capture;
    };

    prototype.captureLogsLimit = function(limit)
    {
        this.settings.captureLogsLimit = limit;
    };

    prototype.flushCapturedLogsOnLimit = function(flushCapturedLogsOnLimit)
    {
        this.settings.flushCapturedLogsOnLimit = flushCapturedLogsOnLimit;
    };

    prototype.flushCapturedLogsOnError = function (flushCapturedLogsOnError) {
        this.settings.flushCapturedLogsOnError = flushCapturedLogsOnError;
    };

    prototype.debug = function (message, data, cb) {
        return this.trigger(message, consts.logLevels.DEBUG, data, cb);
    };

    prototype.info = function (message, data, cb) {
        return this.trigger(message, consts.logLevels.INFO, data, cb);
    };

    prototype.warn = function (message, data, cb) {
        return this.trigger(message, consts.logLevels.WARN, data, cb);
    };

    prototype.error = function (message, data, cb) {
        return this.trigger(message, consts.logLevels.ERROR, data, cb);
    };

    prototype.trigger = function (message, level, data, cb) {
        var parsedData;
        parsedData = data || {};
        parsedData.module = parsedData.module || this.settings.module;
        parsedData.date = new Date();
        if (message && this.formatter && !isCollected(data)) //don't format collected message
        {
            message = this.formatter(message, parsedData);
        }
        if (this.settings.captureLogs)
        {
            if (this.settings.flushCapturedLogsOnError && level.value >= consts.logLevels.ERROR.value)
            {
                this.flushCapturedLogs(this.settings.flushCapturedLogsOnError.logLevel, this.settings.flushCapturedLogsOnError.handlerTypes);
            }
            else
            {
                this.capturedLogs.push({
                    message: message,
                    level: level,
                    data: parsedData
                });
                if (this.capturedLogs.length >= this.settings.captureLogsLimit)
                {
                    if (this.settings.flushCapturedLogsOnLimit)
                    {
                        this.flushCapturedLogs(this.settings.flushCapturedLogsOnLimit.logLevel, this.settings.flushCapturedLogsOnLimit.handlerTypes);
                    }
                    else {
                        this.capturedLogs.shift();
                    }
                }
            }

        }
        if (enabledFor.call(this,level))
        {
            if (this.handlers && this.handlers.constructor === Array) {
                this.handlers.forEach(function(handler)
                {
                    if (!isCollected(data) || handler.type != 'console') { //don't log to console messages that were collected from there.
                        write(handler, message, level, parsedData, cb);
                    }
                });
            }
        }
        else
		{
            if (cb){
            	cb(false);
			}
		}
    };

    prototype.getCapturedLogs = function()
    {
        return this.capturedLogs;
    };

    prototype.flushCapturedLogs = function(logLevel, handlerTypes, cb)
    {
    	var level;
    	var self = this;
    	var writeCount = 0;
        level = consts.logLevels[logLevel.toUpperCase()]
    	if (!level)
		{
            level = consts.defaultFlushLogLevel;
		}
        this.capturedLogs.forEach(function(log)
		{
            if (log.level.value >= level.value)
			{
                writeCount++;
                if (handlerTypes) {
                    handlerTypes.forEach(function (handlerType) {
                        write(self.getHandlerByType(handlerType), log.message, log.level, log.data);
                    });
                }
			}
        });
        this.capturedLogs = [];
        if (cb) {
            cb(writeCount);
        }

    };

    prototype.getHandlerByType = function (type) {
        var handlerRet;
        this.handlers.some(function (handler) {
            if (handler.type === type)
            {
                handlerRet = handler;
                return true;
            }
        });
        return handlerRet;
    };

    prototype.getHandlerTypes = function () {
        return this.handlers.map(function (handler) {
        	return handler.type;
        });
    };

    prototype.addHandler = function(handler)
    {
        if (typeof handler === 'function')
        {
            this.handlers.push({type: 'custom', write: handler});
        }
        else {
            this.handlers.push(handler);
        }
    };

    var write = function(handler, message, level, data, cb)
	{
	    if (!handler)
        {
            return;
        }
        if (handler.asyncWrite)
        {
            handler.asyncWrite(message, level, data, function(){if (cb){cb(true)};});
        }
        else
        {
            handler.write(message, level, data);
            if (cb){
                cb(true);
            }
        }
	};

    var collect = function() {
        var self = this;
        if (console.log) {
            var oldLog = console.log;
            console.log = function (message, data) {
                if (!data || !data.noCollect) {
                    self.trigger(message, consts.logLevels.DEBUG, {collected: true});
                }
                oldLog.apply(console, arguments);
            }
        }
        if (console.debug) {
            var oldDebug = console.debug;
            console.debug = function (message, data) {
                if (!data || !data.noCollect) {
                    self.trigger(message, consts.logLevels.DEBUG, {collected: true});
                }
                oldDebug.apply(console, arguments);
            }
        }
        if (console.info) {
            var oldInfo = console.info;
            console.info = function (message, data) {
                if (!data || !data.noCollect) {
                    self.trigger(message, consts.logLevels.INFO, {collected: true});
                }
                oldInfo.apply(console, arguments);
            }
        }
        if (console.warn)
        {
            var oldWarn = console.warn;
            console.warn = function(message, data){
                if (!data || !data.noCollect) {
                    self.trigger(message, consts.logLevels.WARN, {collected: true});
                }
                oldWarn.apply(console, arguments);
            }
        }
        if (console.error) {
            var oldError = console.error;
            console.error = function (message, data) {
                if (!data || !data.noCollect) {
                    self.trigger(message, consts.logLevels.ERROR, {collected: true});
                }
                oldError.apply(console, arguments);
            }
        }
        window.onerror = function (msg, url, lineNo, columnNo, error) {
            var message = [
                'Message: ' + msg,
                'URL: ' + url,
                'Line: ' + lineNo,
                'Column: ' + columnNo
            ];
            if (error && error.stack)
            {
                message.push('Stack: ' + error.stack);
            }
            message = message.join(' - ');
            self.trigger(message, consts.logLevels.ERROR, {collected: true});
        }
    };

    var isCollected = function(data)
    {
        return data && data.collected;
    };

    var enabledFor = function (level) {
        var logLevel = this.settings.logLevel;
        return level.value >= logLevel.value;
    };

    var create = function(config)
    {
        if (!config)
        {
            config = {id: 'logger' + loggerCount};
        }
        else if (!config.id)
        {
            config.id = 'logger' + loggerCount;
        }
        var logger = new AnyLogger(config);
        loggers[logger.id] = logger;
        loggerCount++;
        return logger;
    };

    var getLoggerById = function (id) {
        return loggers[id]
    };

    var addPlugin = function(plugin)
    {
        plugins.push(plugin);
    }

    consts.logLevels = {};
    consts.logLevels.DEBUG = {value: 1, name: 'DEBUG'};
    consts.logLevels.INFO = {value: 2, name: 'INFO'};
    consts.logLevels.WARN = {value: 4, name: 'WARN'};
    consts.logLevels.ERROR = {value: 5, name: 'ERROR'};
    consts.logLevels.FATAL = {value: 9, name: 'FATAL'};
    consts.logLevels.OFF = {value: 10, name: 'OFF'};
    consts.defaultLogLevel = consts.logLevels.OFF;
    consts.defaultFlushLogLevel = consts.logLevels.DEBUG;
    consts.defaultCaptureLogsLimit = 1000;

    return {
        create: create,
        getLoggerById: getLoggerById,
        consts: consts,
        addPlugin: addPlugin
    };
}));