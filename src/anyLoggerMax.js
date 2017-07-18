/**
 * Created by guy.kaufman on 25/03/2017.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./anyLogger', './htmlHandler', './serviceHandler'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.AnyLoggerMax = factory(root.AnyLogger, root.HTMLHandler, root.ServiceHandler);
    }

}(this, function (anyLogger, htmlHandler, serviceHandler) {
    anyLogger.addPlugin(htmlHandler);
    anyLogger.addPlugin(serviceHandler);
    return anyLogger;
}));