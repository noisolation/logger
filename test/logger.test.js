var assert = require('assert');
var bunyan = require('bunyan');
var logger = require('..');

describe('@noisolation/logger', function() {
    describe('logger()', function() {
        it('should retrun a bunyan logger object', function() {
            var log = logger('test');
            assert(log instanceof bunyan);
        });
        it('should have a logger.name property', function() {
            var name = 'test-logger';
            var log = logger(name);
            assert.equal(log.name, name);
        });
        it('should have a handleError function', function() {
            assert.equal(typeof logger('test').reportError, 'function');
        });
    });

    describe('reportError', function() {
        it('should have logger as context', function(done) {
            logger.configure({
                reportError: function() {
                    assert(this instanceof bunyan);
                    assert.equal(this.name, 'test');
                    done();
                }
            });
            var log = logger('test');
            log.reportError();
        });
    });
});
