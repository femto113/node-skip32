'use strict';
// jshint node: true
/* globals describe, it */
var expect = require('expect.js');
var Skip32 = require('./skip32').Skip32;

describe('Skip32', function() {
    describe('encrypt/decrypt', function() {
        var key = [0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xff, 0xff];
        var skip32 = new Skip32(key);

        it('handles 2^0', function() {
            var n = Math.pow(2, 0);
            expect(skip32.decrypt(skip32.encrypt(n))).to.be(n);
        });

        it('handles 2^1', function() {
            var n = Math.pow(2, 1);
            expect(skip32.decrypt(skip32.encrypt(n))).to.be(n);
        });

        it('handles 2^10', function() {
            var n = Math.pow(2, 10);
            expect(skip32.decrypt(skip32.encrypt(n))).to.be(n);
        });

        it('handles 2^30', function() {
            var n = Math.pow(2, 30);
            expect(skip32.decrypt(skip32.encrypt(n))).to.be(n);
        });

        it('handles 2^31', function() {
            var n = Math.pow(2, 31);
            expect(skip32.decrypt(skip32.encrypt(n))).to.be(n);
        });

        it('handles 2^32-1', function() {
            var n = Math.pow(2, 32) - 1;
            expect(skip32.decrypt(skip32.encrypt(n))).to.be(n);
        });
    });

    describe('encrypt', function() {
        it('handles vector from original C version', function() {
            var key = [0x00, 0x99, 0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11];
            var input = 0x33221100;
            var expected = 0x819d5f1f;

            var skip32 = new Skip32(key);
            var actual = skip32.encrypt(input);
            expect(actual).to.be(expected);
        });

        it('it consistent with C version (1)', function() {
            var key = [0x00, 0x99, 0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11];
            var input = 0xffffffff;
            var expected = 0x32ff23b2;

            var skip32 = new Skip32(key);
            var actual = skip32.encrypt(input);
            expect(actual).to.be(expected);
        });

        it('it consistent with C version (2)', function() {
            var key = [0xff, 0x99, 0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11];
            var input = 0xffffff44;
            var expected = 0x5fbc2a31;

            var skip32 = new Skip32(key);
            var actual = skip32.encrypt(input);
            expect(actual).to.be(expected);
        });
    });
});
