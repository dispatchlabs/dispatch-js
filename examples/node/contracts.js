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
    console.log('\n\n--- SMART CONTRACT EXAMPLES ---\n');

    // Create an Account object to sign the transactions with
    const test = new Dispatch.Account({name: 'NodeSDKTest', privateKey: '5dfdede161969f7f9fa1e2fe35ff596520c8f2856e5e4349bad54fef4b6b2ea2' });


    /******************* 
    DEPLOYING A CONTRACT 
    ********************/

    // Provide source code as a string
    const sourceCode = 'pragma solidity ^0.4.24;contract math { function plusOne(uint256 y) pure public returns(uint256 x) { x = y + 1; } }';
    console.log('Source code:\n' + sourceCode + '\n');

    // Use Transaction.compileSource to easily compile solidity code
    const compiled = Dispatch.Transaction.compileSource(sourceCode);
    console.log('Compiled contract:');
    console.log(compiled);

    // Accounts can create Smart Contracts using compiled values
    const contract = test.createContract(compiled.contracts[0].bytecode, compiled.contracts[0].abi);
    console.log('\nNew contract:\n' + contract + '\n');

    // Calling "send" on the Transaction will return the original Promise (not re-send the tx)
    contract.send()
      .then(
        (ok) => {
          // Once a contract is created, it can be Written to
          contract
            .whenStatusEquals('Ok')
              .then((result) => {

                console.log('Contract creation result:\n' + JSON.stringify(result) + '\n');

                // Exection happens from the account, to the contract, along with the method and parameters
                const write = test.executeWrite(contract, 'plusOne', [1.0]);
                console.log('Contract write:\n' + write + '\n');
                write
                  .whenStatusEquals('Ok')
                    .then((result) => {
                      console.log('Contract Write result:\n' + JSON.stringify(result) + '\n');
                    }, (err) => {
                      console.log('Contract Write result error:\n' + JSON.stringify(err) + '\n');
                      // Reset
                      tearDown();
                    });

                //You can also read from a contract without writiing to the ledger
                //Reads are free and much much faster
                const read = test.executeRead(contract, 'plusOne', [1.0]);
                read
                  .then((result) => {
                    console.log('Contract Read result:\n' + JSON.stringify(result) + '\n');
                  }, (err) => {
                      console.log('Contract Read result error:\n' + JSON.stringify(err) + '\n');
                      // Reset
                      tearDown();
                    });

              }, (err) => {
                console.log('Contract creation result error:\n' + JSON.stringify(err) + '\n');
                // Reset
                tearDown();
              });
        },
        (err) => {
          console.log('Contract creation result error:\n' + JSON.stringify(err) + '\n');
        }
      );
  });
};
