AnyLoggerJS ![Build Status](https://travis-ci.org/kaufguy/AnyLogger.svg?branch=master)
=======================

Simple JavaScript log tools, that can be extended and modified to fit most of your logging needs.

## Table of Contents

* [Quick Start](#quick-start)
* [Settings](#settings)
* [Demo](#demo)
* [API](#api)

## Quick Start
Add AnyLogger or AnyLoggerMax file to your project and consume it through <script> or AMD loader.
Next, AnyLogger is ready to crate a logger instance and start logging. It comes with default behavior, but you might want to add setup settings. See [Settings](#settings) for more information.

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

## Settings
AnyLogger accept setup settings in the 'create' call. Most of the settings can be changed on a later stage using the [API](#api).
```javascript
AnyLogger.create(settings);
```
| Setting                  | Value                                   | Description                                       |    
| ------------------------ | ----------------------------------------| --------------------------------------------------|
| logLevel                 | 'debug', 'info', 'warn', 'error', 'off' | set the log level from which you want to see logs |
| module                   | string                                  | set the module for the log messages               |
| collect                  | boolean                                 | configure if to collect global errors and console logs  |
| captureLogs              | boolean                                 | configure if to capture logs or not                     |
| captureLogsLimit         | integer                                 | set the limit of how many captured logs to store  |
| flushCapturedLogsOnError | {handlerTypes:[''],logLevel:''}         | configure if to                                                                                                                        [flush](#anyloggerflushcapturedlogsloglevel-handlertypes) all the                                                                        captured logs, when an error level is logged      |
| flushCapturedLogsOnLimit | {handlerTypes:[''],logLevel:''}         | configure if to                                                                                                                        [flush](#anyloggerflushcapturedlogsloglevel-handlertypes) all the                                                                        captured logs, when it reaches the limit          |
| logToConsole             | boolean                                 | configure if to use the console handler or not          |
| logToHtml (Max only)     | {container:''}                          | configure if to use the HTML handler (available only on AnyLoggerMax) or not and which HTML container to use |
| logToService (Max only)  | {loggingUrl:'', batchSize:integer,                                                                                                    flushOnWindowClose:boolean,                                                                                                              headers: [{'':''}]}                       | configure if to use Service handler (available only on                                                                                AnyLoggerMax) or not and set it's configuration |

## Demo
Check out demoLight and demoMax to see AnyLogger in action.

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
    plugin - plugin object with create function. 
    
## API - Instance

### loggerInst.debug(message, data)
### loggerInst.info(message, data)
### loggerInst.warn(message, data)
### loggerInst.error(message, data)

Logs the provided message with formatting and handling according to the data.

  * #### Parameters
    message - string messege
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

configures if to [flush](#anyloggerflushcapturedlogsloglevel-handlertypes) all the captured logs, when an error level is logged. This is useful if you only interested in investigating errors and need extended data of the logs that could guid to that error.

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
    handler- object that contains the properties 'type': string of the handler type(name) and 'write': function that recieves a string message, log level and data(#parameters-3).
