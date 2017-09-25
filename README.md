AnyLoggerJS ![Build Status](https://travis-ci.org/kaufguy/AnyLogger.svg?branch=master)
=======================
AnyLogger is a simple open-source, no dependencies, JavaScript log tools, that can be extended and modified to fit most of your logging needs. AnyLogger is available in a lightweight (~1.8kb min+gzip) [anyLogger.js](https://github.com/kaufguy/AnyLogger/blob/master/dev/anyLogger.js) or extended [anyLoggerMax.js](https://github.com/kaufguy/AnyLogger/blob/master/dev/anyLoggerMax.js) versions.

## Main Capabilities

* [Console Logging](#console-logging)
* [HTML Logging](#html-logging) (AnyLoggerMax only)
* [Service Logging](#service-logging) (AnyLoggerMax only)
* [Global Log Collecting](#global-log-collecting)
* [Log Capture](#log-capture)
* [Formatter](#formatter)
* [Handlers](#handlers)
* [Plugins](#plugins)

## Table of Contents

* [Quick Start](#quick-start)
* [Demo](#demo)
* [Settings](#settings)
* [Console Logging](#console-logging)
* [HTML Logging](#html-logging)
* [Service Logging](#service-logging)
* [Global Log Collecting](#global-log-collecting)
* [Log Capture](#log-capture)
* [Formatter](#formatter)
* [Handlers](#handlers)
* [Plugins](#plugins)
* [API](#api)

## Quick Start
Add AnyLogger or AnyLoggerMax file to your project and consume it through <script> or AMD / CommonJS loader.
Next, AnyLogger is ready to crate a logger instance and start logging. It comes with default behavior, but you might want to add some setup [settings](#settings).

```html
<html>
  <body>
    <script type="text/javascript" src="./anyLogger.js"></script>
    <script type="text/javascript">
      var loggerInst = AnyLogger.create();
      loggerInst.debug('hello world');
    </script>
  </body>
</html>
```

## Demo
Check out [demoLight](https://github.com/kaufguy/AnyLogger/tree/master/demoLight) and [demoMax](https://github.com/kaufguy/AnyLogger/tree/master/demoMax) to see AnyLogger in action.

## Settings
AnyLogger accept setup settings in the 'create' call. Most of the settings can be changed on a later stage using the [API](#api).
```javascript
AnyLogger.create(settings);
```
| Setting                  | Value                                   | Description                                       |    
| ------------------------ | ----------------------------------------| --------------------------------------------------|
| id                       | string                                  | logger instance id 
| logLevel                 | 'debug', 'info', 'warn', 'error', 'off' | set the log level from which you want to see logs |
| module                   | string                                  | set the module for the log messages               |
| [formatter](#formatter)  | function                                | function that receives a string message and a data object                                                                              and returns a formatted string message              |
| [handlers](#handlers)    | array of handlers                       | array of handlers which do the actual logging work|
| useFormatter             | boolean                                 | configure if to use the default formatter in case no custom                                                                            formatter was set                                   |
| collect                  | boolean                                 | configure if to collect global errors and console logs  |
| captureLogs              | boolean                                 | configure if to capture logs or not                     |
| captureLogsLimit         | integer                                 | set the limit of how many captured logs to store  |
| flushCapturedLogsOnError | {handlerTypes:[''],logLevel:''}         | configure if to                                                                                                                        [flush](#anyloggerflushcapturedlogsloglevel-handlertypes) all the                                                                        captured logs, when an error level is logged      |
| flushCapturedLogsOnLimit | {handlerTypes:[''],logLevel:''}         | configure if to                                                                                                                        [flush](#anyloggerflushcapturedlogsloglevel-handlertypes) all the                                                                        captured logs, when it reaches the limit          |
| logToConsole             | boolean                                 | configure if to use the console handler or not          |
| logToHtml (Max only)     | {container:''}                          | configure if to use the HTML handler (available only on AnyLoggerMax) or not and which HTML container to use |
| logToService (Max only)  | {loggingUrl:'', batchSize:integer,                                                                                                    flushOnWindowClose:boolean,                                                                                                              headers: [{'':''}]}                       | configure if to use Service handler (available only on                                                                                AnyLoggerMax) or not and set it's configuration |

## Console Logging
Default handler that logs messages to the console

## HTML Logging
Handler that logs to an HTML table that can be filtered, sorted and cleared. Very useful for mobile devices. Only available in AnyLoggerMax.

## Service Logging
Handler that logs to a server through an HTTP request. You can configure the service URL, request headers, batch size of the logs on each request and if to flush the remaining logs on window close event. Very useful for production monitoring. Only available in AnyLoggerMax.

## Global Log Collecting
AnyLogger can collect global errors / exceptions (window.onerror) and console logs and route them through the handlers. Very useful for investigating environment / system related errors as well as unhandled code.

## Log Capture
AnyLogger can store logs until it suites you to flush them with [flushCapturedLogs](#anyloggerflushcapturedlogsloglevel-handlertypes). You can configure the limit of how many logs to store using [captureLogsLimit](#anyloggercapturelogslimitlimit) and if to flush them when the limit is reached [flushCapturedLogsOnLimit](#anyloggerflushcapturedlogsonlimitflushonlimit) or when en error level log is received [flushCapturedLogsOnError](#anyloggerflushcapturedlogsonerrorflushonerror). Very useful for mobile devices and if you want to keep your console clean.

## Formatter
Formatter is a simple function that receives a string message and data object as input. It returns a formatted string message that will be used as an input message to the [handlers](#handlers). All non-collected messages are routed through the formatter. AnyLogger comes with a default formatter that can be disabled with 'useFormatter' configuration.
```javascript
logger.create({
	formatter: function(message, data){return "[" + data.module + "][" + data.scope + "]" + message},
	module: 'moduleName',
	logLevel: 'debug',
});
```
## Handlers
Handlers are objects which provides a 'write' function that receives a string message, log level and data. According to configuration, log messages are routed through the handlers so they can do some logging work with them. Handlers can provide their own API that would be available when retrieving their instance through [getHandlerByType](#anyloggergethandlerbytypetype). AnyLogger comes with one default 'console' handler and AnyLoggerMax also comes with 'html' and 'service' handlers. You can provide your own custom handler and set it with [addHandler](#anyloggeraddhandlerhandler) or with [settings](#settings). You can set the handler as a function or an object.
```javascript
var loggerInst = logger.create({
	handlers: [handlers: [function(message, level, data){console.debug(message)}],
	module: 'moduleName',
	logLevel: 'debug',
});
loggerInst.addHandler({
	type: 'customHandler',
	write: function(message, level, data) {
		//do somthing
	},
	apiFunc1: function(){//do somthing},
});
```
## Plugins
Plugins are module objects, which provides a 'create' function that receives the AnyLogger class and the provided settings. Plugins can manipulate AnyLogger freely, with complete access to it's infrastructure. You can provide your own custom plugin and set it with [addPlugin](#anyloggeraddpluginplugin)
```javascript
anyLogger.addPlugin({create: function(anyLoggerClass, setting){
	//do somthing
}});
```
## API
### AnyLogger.create(settingsObj)

Returns AnyLogger instance to start logging.
  * #### Parameters
    settingsObj - (optional) setup [Settings](#settings) object.

### AnyLogger.getLoggerById(id)

retrieves AnyLogger instance by id. 

  * #### Parameters
    id - id of the instance. 

### AnyLogger.addPlugin(plugin)

registers a plugin class. 

  * #### Parameters
    [plugin](#plugins) - plugin object with create function. 
    
## API - Instance

### loggerInst.debug(message, data)
### loggerInst.info(message, data)
### loggerInst.warn(message, data)
### loggerInst.error(message, data)

Logs the provided message with formatting and handling according to the data.

  * #### Parameters
    message - string message
    data - (optional) object that can contain the properties 'module' and 'scope'. 

### loggerInst.logLevel(level)

Sets the logging level. Returns the log level.

  * #### Parameters
    level - (optional) logLevel string or object.

### AnyLogger.captureLogs(capture)

turn log capture on / off.

  * #### Parameters
    capture - boolean value. 

### AnyLogger.captureLogsLimit(limit)

set the limit of how many captured logs to store.

  * #### Parameters
    limit - integer value. 
    
### AnyLogger.flushCapturedLogsOnLimit(flushOnLimit)

configures if to [flush](#anyloggerflushcapturedlogsloglevel-handlertypes) all the captured logs when it reaches the limit.

  * #### Parameters
    flushOnLimit - object that contains the properties 'logLevel': the minimum level of logs you want to flush and 'handlerTypes': which     handlers you want to log to.    
    
### AnyLogger.flushCapturedLogsOnError(flushOnError)

configures if to [flush](#anyloggerflushcapturedlogsloglevel-handlertypes) all the captured logs, when an error level is logged. This is useful if you only interested in investigating errors and need extended data of the logs that could guide to that error.

  * #### Parameters
    flushOnError - object that contains the properties 'logLevel': the minimum level of logs you want to flush and 'handlerTypes': which     handlers you want to log to.
    
### AnyLogger.getCapturedLogs()

return the captured logs.
    
### AnyLogger.flushCapturedLogs(logLevel, handlerTypes)

flush all the captured logs.
    
  * #### Parameters
    logLevel- the minimum level of logs you want to flush.
    handlerTypes- array of handler types you want to log to.
    
### AnyLogger.addHandler(handler)

adds an handler to log messages to.
    
  * #### Parameters
    [handler](#handlers)- object that contains the properties 'type': string of the handler type(name) and 'write': function that receives a string message, log level and data.
    
### AnyLogger.getHandlerByType(type)

return an handler instance by it's type.
    
  * #### Parameters
    type- string of an handler type.

