/*!
 * @dispatchlabs/dispatch-js <https://github.com/dispatchlabs/disnode_sdk>
 *
 * Copyright © 2018, [Dispatch Labs](http://dispatchlabs.io).
 * Released under the LGPL v3 License.
 */

'use strict'

const Dispatch = {
	ENV: 'production'
};

Dispatch.Network = require('./models/Network');
Dispatch.Account = require('./models/Account');
Dispatch.Transaction = require('./models/Transaction');

module.exports = Dispatch;