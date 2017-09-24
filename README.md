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
| Setting                  | Values                                  | Description                                       |    
| ------------------------ | ----------------------------------------| --------------------------------------------------|
| logLevel                 | 'debug', 'info', 'warn', 'error', 'off' | set the log level from which you want to see logs |

## Demo
Check out demoLight and demoMax to see AnyLogger in action.

## API
### AnyLogger.create(settingsObj)

  * #### Description
    Returns AnyLogger instance to start logging.

  * #### Parameters
    settingsObj - (optional) setup [Settings](#settings) object.

### AnyLogger.getLoggerById(id)

  * #### Description
    retrieves AnyLogger instance by id. 

  * #### Parameters
    id - id of the instance. 

### AnyLogger.addPlugin(plugin)

  * #### Description
    registers a plugin class. 

  * #### Parameters
    plugin - plugin object with create function. 
    
## API - Instance

### loggerInst.debug(message, data)
### loggerInst.info(message, data)
### loggerInst.warn(message, data)
### loggerInst.error(message, data)

  * #### Description
    Logs the provided message with formatting and handling according to the data.

  * #### Parameters
    message - string messege
    data - (optional) object that can contain the properties 'module' and 'scope'. 

### loggerInst.logLevel(level)

  * #### Description
    Sets the logging level. Returns the log level.

  * #### Parameters
    level - (optional) logLevel string or object.

### AnyLogger.captureLogs(capture)

  * #### Description
    turn log capture on / off.

  * #### Parameters
    capture - boolean value. 

### AnyLogger.captureLogsLimit(limit)

  * #### Description
    set the limit of how many captured logs to store.

  * #### Parameters
    limit - integer value. 
    
### AnyLogger.flushCapturedLogsOnLimit(flushOnLimit)

  * #### Description
    configures if to [flush](#anyloggerflushcapturedlogsloglevel-handlertypes) all the captured logs when it reaches the limit.

  * #### Parameters
    flushOnLimit - object that contains the properties 'logLevel': the minimum level of logs you want to flush and 'handlerTypes': which     handlers you want to log to.    
    
### AnyLogger.flushCapturedLogsOnError(flushOnError)

  * #### Description
    configures if to [flush](#anyloggerflushcapturedlogsloglevel-handlertypes) all the captured logs, when an error level is logged. This is useful if you only interested in investigating errors and need extended data of the logs that could guid to that error.

  * #### Parameters
    flushOnError - object that contains the properties 'logLevel': the minimum level of logs you want to flush and 'handlerTypes': which     handlers you want to log to.
    
### AnyLogger.getCapturedLogs()

  * #### Description
    return the captured logs.
    
### AnyLogger.flushCapturedLogs(logLevel, handlerTypes)

  * #### Description
    flush all the captured logs.
    
  * #### Parameters
    logLevel- the minimum level of logs you want to flush.
    handlerTypes- which handlers you want to log to.
