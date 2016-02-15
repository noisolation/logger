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

        it('should log error', function(done) {
            logger.configure({});
            var log = logger('test');
            var expected = 'bip bop';
            log.error = msg => {
                assert.equal(msg, expected);
                done();
            };
            log.reportError(expected);
        });

        it('should report error to rollbar', function(done) {
            var expected = 'foo bop';
            var name = 'test-report';
            logger.configure({
                rollbar: {
                    handleErrorWithPayloadData: function(msg, payload) {
                        assert.equal(msg, expected);
                        assert.equal(typeof payload, 'object');
                        assert.equal(payload.custom.name, name);
                        done();
                    }
                }
            });

            var log = logger(name);
            log.error = function noop() {};
            log.reportError(expected);
        });

        it('should return the passed error object', function() {
            logger.configure({});
            var log = logger('test');
            var expected = new Error('bip bop');
            var ret = log.reportError(expected);
            assert(ret instanceof Error);
            assert.equal(ret.message, expected.message);
        });
    });
});
