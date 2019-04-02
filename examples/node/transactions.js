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
    console.log('\n\n--- TRANSACTION EXAMPLES ---\n');

  // START SETUP

    console.log('Setting up...');
    // Account is a constructor with no required inputs
    const temp = new Dispatch.Account();
    // It can also accept any account fields; the most prominant being the privateKey
    const test = new Dispatch.Account({name: 'NodeSDKTest', privateKey: '5dfdede161969f7f9fa1e2fe35ff596520c8f2856e5e4349bad54fef4b6b2ea2' });

    // Use account.init() to generate a private key
    temp.init();

    // Account objects can send tokens to other accounts directly; returning the resulting Transaciton
    let tx = test.sendTokens(temp, 50000);

    // Calling "send" on the Transaction will return the original Promise (not re-send the tx)
    tx.send()
      .then(
        (ok) => {
          // Use 'whenStatusEquals' (returns a Promise) to wait for the transaction to finish
          tx.whenStatusEquals('Ok')
            .then(
              (result) => {
                
  // END SETUP

                // Transactions may be created and executed directly
                tx = new Dispatch.Transaction({
                  from: temp,
                  to: test,
                  value: 5
                });
                console.log('New Transaction:\n' + tx + '\n');

                // Transactions can also be sent directly, which returns a Promise
                tx.send()
                  .then((result) => {
                    console.log('Transaction submission:\n' + JSON.stringify(result) + '\n');

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
                              resolve();
                            });

                        }, (err) => {
                          console.error('Transaction status check error result:\n' + JSON.stringify(err) + '\n');
                        }
                      );
                  }, (err) => {
                    console.error('Transaction send error result:\n' + JSON.stringify(err) + '\n');
                  });


              }, (err) => {
                console.log('Setup failed!');
                console.error(err);
              }
            );
        },
        (err) => {
          console.log('Setup failed!');
          console.error(err);
        }
      );
  });
};
