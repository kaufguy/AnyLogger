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
    <script type="text/javascript" src="../anyLogger.js"></script>
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


