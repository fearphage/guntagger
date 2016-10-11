/*jslint node: true*/
'use strict';

var guntagger = require('./lib/guntagger');

function chain(Gun) {
	Gun.chain.init = Gun.chain.init || Gun.chain.set;
	guntagger(Gun);
	return Gun;
}

if (typeof window !== 'undefined' && window.Gun) {
  chain(window.Gun);
}

module.exports = chain;