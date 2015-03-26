# skip32

Originally a node binding of the C code, this module is now a javascript port of
skip32.c by Greg Rose once found here (as of March 2015 this link no longer working):

http://www.qualcomm.com.au/PublicationsDocs/skip32.c

SKIP32 is a 80-bit key, 32-bit block symmetric cipher based on [Skipjack](http://en.wikipedia.org/wiki/Skipjack_%28cipher%29).
It has the uncommon properties of being fast, creating very dissimilar encrypted values for consecutive
input values, and producing output of the same size as the input (32-bit).  These make this cipher
particularly useful for obfuscating series of 32-bit integers (e.g. auto-incremented database ids).
It is probably not appropriate for general cryptography.

CF. http://search.cpan.org/~esh/Crypt-Skip32-0.17/lib/Crypt/Skip32.pm for more discussion.

## Install

    npm install skip32

or

    git clone http://github.com/femto113/node-skip32.git
    cd skip32
    npm link

## Example

    var Skip32 = require("skip32").Skip32;

    // 80-bit key is provided to constructor as array of up to 10 bytes
    // (if fewer than 10 bytes are provided, they will be repeated)
    var cipher = new Skip32([0x9b, 0x21, 0x96, 0xe, 0x1a, 0xcf, 0x24, 0x5f, 0x14, 0x93]);

    // NOTE: unlike the objects created by crypto.createCipher,
    //       a Skip32 instance can be reused an unlimited number of times

    // encrypt/decrypt take and return 32-bit unsigned integers (uint32)
    var e = cipher.encrypt(1);
    // e == 585760678
    var d = cipher.decrypt(e);
    // d == 1
    a = [cipher.encrypt(2), cipher.encrypt(3), cipher.encrypt(4)];
    // a == [ 534177265, 2331760290, 3033114818 ]

    // node's built in hash algorithms can be handy for making keys, e.g.
    var key = require('crypto').createHash('md5').update("some text here").
              digest().substring(0, 10).split('').map(function (c) { return c.charCodeAt() });


## Changes

* 1.2.1 - add short key repitition logic from C++ version
* 1.2.0 - switch to pure Javascript implementation by @imuli (should work with all versions of Node)
* 1.1.0 - updated to work with Node 0.12.X (use 1.0.2 for earlier versions of Node)
