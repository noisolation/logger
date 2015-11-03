# Logger

Small wrapper around `bunyan` used internally in our services.

## Usage

### Plain bunyan logger

``` javascript
var logger = require('@noisolation/logger')('<logger name>');

// Then use it as a regular bunyan logger.
logger.info('message');
```

### Configure logger

This should be called before you start logging anything else.

``` javascript
var Logger = require('@noisolation/logger');
Logger.configure({
    logger: { /* Bunyan logger options */ },
    reportError: function() { /* overwrite reportError */ },
    rollbar: { /* Rollbar instance (for logger.reportError) */ }
});
```

### `reportError`

By default the logger does not send Errors logged with `logger.error` anywhere but to `bunyan`. To report things to Rollbar use the `logger.reportError` function:

``` javascript
var logger = require('@noisolation/logger')('<logger name>');
logger.reportError(new Error('test'), { /* Rollbar payload options */ }, request)
```
