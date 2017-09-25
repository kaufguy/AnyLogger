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

var log = function(){
    loggerInst.error(document.getElementById("text-to-log").value);
}

var logButton = document.getElementById("log-button");
logButton.addEventListener("click", log);