'use strict';

let bunyan = require('bunyan');
let config = {};
const level = process.env.DISABLE_LOGGER ? bunyan.FATAL + 1 : 'debug';

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
    // Log as error for regular bunyan stream
    this.error(err);

    if (config.rollbar && typeof config.rollbar.handleErrorWithPayloadData === 'function') {
        let message;

        if (typeof payload === 'string') {
            message = payload;
            payload = { custom: { message } };
        }

        payload = payload || {};
        payload.custom = payload.custom || {};
        payload.custom.name = payload.custom.name || this.name;

        config.rollbar.handleErrorWithPayloadData(err, payload, req);
    }

    return err;
}
