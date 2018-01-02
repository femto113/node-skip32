var Skip32 = require('./skip32.js').Skip32;
var assert = require('assert');

// these are the default test values from the original C code
var KEY = [ 0x00,0x99,0x88,0x77,0x66,0x55,0x44,0x33,0x22,0x11 ];
var INPUT = parseInt("33221100", 16)
var ENCRYPTED = parseInt("819d5f1f", 16);

console.log("running the default test case");

var s = new Skip32(KEY);
var e = s.encrypt(INPUT);
var d = s.decrypt(e);

console.log("expected:", INPUT.toString(16), "->", ENCRYPTED.toString(16), "->", INPUT.toString(16));
console.log("     got:", INPUT.toString(16), "->", e.toString(16), "->", d.toString(16));
console.log();

// verify that key extension logic works as expected (bytes of short keys should repeat, not get padded with zeros unless lpadZero param given) 
var SHORT_KEY = [ 0xDE, 0xAD, 0xBE, 0xEF ], short = new Skip32(SHORT_KEY);
var REPEATED_SHORT_KEY = [ 0xDE, 0xAD, 0xBE, 0xEF, 0xDE, 0xAD, 0xBE, 0xEF, 0xDE, 0xAD ], repeated_short = new Skip32(REPEATED_SHORT_KEY);
var RIGHT_PADDED_SHORT_KEY = [ 0xDE, 0xAD, 0xBE, 0xEF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ], right_padded_short = new Skip32(RIGHT_PADDED_SHORT_KEY);
var LEFT_PADDED_SHORT_KEY = [ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xDE, 0xAD, 0xBE, 0xEF ], left_padded_short = new Skip32(LEFT_PADDED_SHORT_KEY);

// verify that the short test key is less than the expected length
assert(SHORT_KEY.length < Skip32.KEYLEN);

assert.equal(short.encrypt(INPUT), repeated_short.encrypt(INPUT));
assert.notEqual(short.encrypt(INPUT), right_padded_short.encrypt(INPUT));
assert.notEqual(short.encrypt(INPUT), left_padded_short.encrypt(INPUT));
// verify optional left padding works as expected
assert.equal((new Skip32(SHORT_KEY, true)).encrypt(INPUT), left_padded_short.encrypt(INPUT));
// verify hex parsing
var SHORT_KEY_HEX = "DEADBEEF";
assert.equal((new Skip32(SHORT_KEY_HEX)).encrypt(INPUT), short.encrypt(INPUT));

// some speed tests follow

var N = Math.pow(10, 6), start;

console.log("encrypting/decrypting", N, "numbers using Skip32...");
start = new Date();
for (var i = 0; i < N; i++) {
  if (s.decrypt(s.encrypt(i)) != i) {
    console.log("Skip32 decrypt/encrypt cycle failed for ", i);
    break;
  }
}
var elapsed = (new Date()) - start;
console.log("...finished in", elapsed / 1000.0, "seconds", "(approx.", Math.round(N / (elapsed / 1000.0)), "cycles per second)");

// for comparison do the same thing using one of the fastest built in ciphers (~7x slower in my tests)
// NOTE: the crypto library is not designed well for this particular usage, e.g. the cipher object isn't reusable

var crypto = require('crypto');
var cipher_name = 'rc4'
console.log("encrypting/decrypting up to", N, "numbers using crypto &", cipher_name, "...");
start = new Date();
for (var i = 0; i < N; i++) {
  var cipher = crypto.createCipher(cipher_name, 'secret'), decipher = crypto.createDecipher(cipher_name, 'secret');
  e = cipher.update(i.toString(16), 'utf8', 'hex') + cipher.final('hex');
  d = parseInt(decipher.update(e, 'hex', 'utf8') + decipher.final('utf8'), 16);
  if (i != d) {
    console.log(cipher_name, "decrypt/encrypt cycle failed for ", i);
    break;
  }
  if ((new Date() - start) > elapsed) break; // only run as long as we did for Skip32 
}
var elapsed = (new Date()) - start;
console.log("...finished", i, "in", elapsed / 1000.0, "seconds", "(approx.", Math.round(i / (elapsed / 1000.0)), "cycles per second)");
