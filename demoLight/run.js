var loggerInst;
loggerInst = AnyLogger.create({
    logLevel: 'debug',
    logToConsole: true,
    captureLogs: true,
    captureLogsLimit: 200,
    collect: true,
    formatter: function(message, data) {
        if (data) {
            if (data.scope) {
                message = "[" + data.scope + "] " + message;
            }
            if (data.module) {
                message = "[" + data.module + "] " + message;
            }
            if (data.date) {
                message = "[" + data.date.toISOString() + "] " + message;
            }
        }
        return message;
    }
});
loggerInst.error('hello', {scope:'scopeWorld', module: 'moduleWorld'});