var loggerInst;
var contextMessage = {
    type: "LogRow",
    message: "userAgent:" + navigator.userAgent,
    level: 'INFO'
};
loggerInst = AnyLogger.create({
    logLevel: 'debug',
    logToConsole: true,
    captureLogs: true,
    captureLogsLimit: 200,
    collect: true,
    logToService: {
        loggingUrl: 'http://' + location.host,
        headers: [{"Content-Type": "application/json"}, {"Authorization": "5067b6e8-f0276"}],
        timeframe: 0.1,
        flushOnWindowClose: true,
        requestParser: function (logRows) {
            var logRowsOut = [contextMessage];
            logRows.forEach(function (row) {
                logRowsOut.push({
                    type: "LogRow",
                    message: row.message,
                    level: row.level,
                });
            })
            return {
                "entities": [{
                    "type": "Log",
                    "logRows": logRowsOut
                }]
            }
        }
    },
    logToHtml: {container: document.getElementById('test-container')},
    flushCapturedLogsOnError:{handlerTypes:['service'], logLevel: 'info'}
});
loggerInst.debug('hello', {scope:'scopeWorld', module: 'moduleWorld'});
loggerInst.error('world', {scope:'scopeWorld', module: 'moduleWorld'});

var log = function(){
    loggerInst.debug(document.getElementById("text-to-log").value);
}

var logButton = document.getElementById("log-button");
logButton.addEventListener("click", log);