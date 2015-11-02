'use strict';

let bunyan = require('bunyan');
let config = {};
const level = 'debug';

module.exports = function(name, options) {
    options = Object.assign({ name, level }, config.logger, options);
    let logger = bunyan.createLogger(options);
    logger.name = name;
    logger.reportError = (config.reportError || defaultReportError).bind(logger);
    return logger;
};

module.exports.configure = function(options) {
    if (typeof options !== 'object') throw new TypeError('options should be an object');
    config = options;
    config.logger = config.logger || {};
};

function defaultReportError(err, payload, req) {
    payload = payload || {};
    if (!config.rollbar || config.rollbar.handleErrorWithPayloadData !== 'function') return;

    payload.name = this.name;
    config.rollbar.handleErrorWithPayloadData(err, payload, req);
}
