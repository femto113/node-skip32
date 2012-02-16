# skip32

This is a node binding for skip32.c by Greg Rose found here:

http://www.qualcomm.com.au/PublicationsDocs/skip32.c

SKIP32 is a 80-bit key, 32-bit block symmetric cipher based on Skipjack.  It has the uncommon properties
of being fast, creating very dissimilar encrypted values for consecutive
input values, and producing output of the same size as the input (32-bit).  These make this cipher
particularly useful for obfuscating series of 32-bit integers (e.g. auto-incremented database ids).
It is probably not appropriate for general cryptography.

CF. http://search.cpan.org/~esh/Crypt-Skip32-0.17/lib/Crypt/Skip32.pm for more discussion.

## Install

    npm install skip32 (TO DO not published yet)

or

    git clone http://github.com/femto113/node-skip32.git
    cd skip32
    npm link

## Example

    var Skip32 = require("skip32").Skip32;

    // 80-bit key is provided to constructor as array of up to 10 bytes (will be repeated as necessary)
    var cipher = new Skip32([0x9b, 0x21, 0x96, 0xe, 0x1a, 0xcf, 0x24, 0x5f, 0x14, 0x93]);

    // NOTE: unlike the objects created by crypto.createCipher a Skip32 instance can be reused an unlimited number of times

    // encrypt/decrypt take and return 32-bit unsigned integers (uint32)
    var e = cipher.encrypt(1);
    // e == 585760678
    var d = cipher.decrypt(e);
    // d == 1
    a = [cipher.encrypt(2), cipher.encrypt(3), cipher.encrypt(4)];
    // a == [ 534177265, 2331760290, 3033114818 ]

    // node's built in hash algorithms can be handy for making keys, e.g.
    var key = require('crypto').createHash('md5').update("some text here").digest().substring(0, 10).split('').map(function (c) { return c.charCodeAt() });
