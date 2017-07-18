/**
 * Created by guy.kaufman on 25/03/2017.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.ServiceHandler = factory();
    }

}(this, function () {
    var consts = {};

    var createServiceHandler = function (anyLogger, settings) {
        var _settings = {};
        var _logRows = [];
        var _interval;
        var _sentCount = 0;

        var initSettings = settings.logToService;

        if (!initSettings || !initSettings.loggingUrl)
        {
            return;
        }

        var init = function (initSettings) {
            if (!initSettings.headers)
            {
                _settings.headers = [consts.defaultServiceHeaders];
            }
            else if (initSettings.headers instanceof Array)
            {
                _settings.headers = initSettings.headers;
            }
            else {
                _settings.headers = [initSettings.headers];
            }

            if (initSettings.timeframe != undefined)
            {
                _settings.sendBy = 'timeframe';
                if (initSettings.timeframe > consts.minTimeframe)
                {
                    _settings.timeframe = initSettings.timeframe;
                }
                else {
                    _settings.timeframe = consts.minTimeframe;
                }
            }
            else {
                _settings.sendBy = 'batchSize';
            }

            if (initSettings.flushOnWindowClose || initSettings.flushOnWindowClose=== undefined)
            {
                flushOnWindowClose();
            }
            _settings.timeframe = _settings.timeframe * 60 * 1000; // convert to milliseconds
            _settings.loggingUrl = initSettings.loggingUrl;
            _settings.batchSize = initSettings.batchSize || consts.defaultBatchSize;
            _settings.timeout = initSettings.timeout || consts.defaultTimeout;
            _settings.requestParser = initSettings.requestParser;

            if (_settings.sendBy === 'timeframe')
            {
                _interval = setInterval(flush, _settings.timeframe, false);
            }
        }

        var writeRow = function(module, scope, message, level, date)
        {
            _logRows.push({
                message: message,
                level: level.name,
                module: module,
                scope: scope,
                date: date
            });
            if (_settings.sendBy === 'batchSize')
            {
                if (_logRows.length >= _settings.batchSize) {
                    send(_logRows);
                }
            }
        };

        var send = function(logRows) {
            if (logRows.length < 1)
            {
                return;
            }
            var xhr = new XMLHttpRequest();
            xhr.open('POST', _settings.loggingUrl, true);

            _settings.headers.forEach(function(header){
                xhr.setRequestHeader(
                    Object.keys(header)[0],
                    header[Object.keys(header)[0]]
                );
            });

            var data;
            if (_settings.requestParser)
            {
                data = JSON.stringify(_settings.requestParser(logRows));
            }
            else
            {
                data = JSON.stringify(logRows);
            }
            xhr.send(data);
            _logRows = [];
            _sentCount++;
        };

        var flush = function()
        {
            send(_logRows);
        }

        var destroy = function()
        {
            clearInterval(_interval);
        };

        var flushOnWindowClose = function()
        {
            window.onbeforeunload = function () {
                flush();
            };
        }

        init(initSettings);

        anyLogger.addHandler({
            type: 'service',
            write: function(message, level, data) {
                writeRow(data.module, data.scope, message, level, data.date)
            },
            flush: flush,
            rowsCount: function(){return _logRows.length;},
            sentCount: function(){return _sentCount;},
            destroy: destroy
        });
    };

    return {create: createServiceHandler};

    consts.defaultServiceHeaders = { 'Content-Type' : 'application/json' };
    consts.defaultTimeout = 2000;
    consts.defaultBatchSize = 1000;
    consts.minTimeframe = 0.1; //min of 6 sec for each send request

}));