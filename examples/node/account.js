/*!
 * @dispatchlabs/dispatch-js <https://github.com/dispatchlabs/disnode_sdk>
 *
 * Copyright © 2018, [Dispatch Labs](http://dispatchlabs.io).
 * Released under the LGPL v3 License.
 */

'use strict'

const Dispatch = require('./../../');

module.exports = () => {
  return new Promise((resolve, reject) => {
    console.log('--- ACCOUNT EXAMPLES ---\n');

    //Optionally set the network to whichever environment you prefer
    new Dispatch.Network("development")
    // Account is a constructor with no required inputs
    const temp = new Dispatch.Account();
    // It can also accept any account fields; the most prominant being the privateKey
    const test = new Dispatch.Account({name: 'NodeSDKTest', privateKey: '5dfdede161969f7f9fa1e2fe35ff596520c8f2856e5e4349bad54fef4b6b2ea2' });

    // Use account.init() to generate a private key
    temp.init();
    // Models output clean strings in logs and JSON.stringify
    console.log('Temp account:\n' + temp + '\n');

    // Account objects can send tokens to other accounts directly; returning the resulting Transaciton
    let tx = test.sendTokens(temp, 50000);
    console.log('New "sendTokens" transaction:\n' + tx + '\n');

    // Calling "send" on the Transaction will return the original Promise (not re-send the tx)
    tx.send()
      .then(
        (ok) => {
          // Use 'whenStatusEquals' (returns a Promise) to wait for the transaction to finish
          tx.whenStatusEquals('Ok')
            .then(
              (result) => {
                console.log('Transaction result:\n' + JSON.stringify(result) + '\n');

                // Reset
                temp.sendTokens(test, 50000).send()
                  .then(() => {
                    resolve();
                  })
                  .catch((e) => {
                    console.log(e)
                    resolve();
                  });

              }, (err) => {
                console.log('Transaction status error:\n' + JSON.stringify(err) + '\n');
              }
            );
        },
        (err) => {
          console.log('Transaction result error:\n' + JSON.stringify(err) + '\n');
        }
      );
  });
};
