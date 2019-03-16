import { default as transactionsClass } from './transactions.class';
import { default as transactionsModel } from './transactions.model';
import { stellarSdkInfo } from '../../config/env/development';
import * as StellarSdk from 'stellar-sdk';

let transactionsCtrl = {};

transactionsCtrl.buildTransaction = async (req, res) => {
    console.log("keypair:", req.body.keyPair)
    let transactionReq = new transactionsClass(req.body);
    StellarSdk.Network.useTestNetwork();
    let server = new StellarSdk.Server(stellarSdkInfo.server);
    let sourceKeys = StellarSdk.Keypair
        .fromSecret(req.body.keyPair.secret);
    let destinationId = transactionReq.destinationId;
    // Transaction will hold a built transaction we can resubmit if the result is unknown.
    let transaction;
    try {
        server.loadAccount(destinationId)
            // If the account is not found, surface a nicer error message for logging.
            .catch(StellarSdk.NotFoundError, function (error) {
                //throw new Error('The destination account does not exist!');
                res.json({
                    status: 400,
                    message: "The destination account does not exist!"
                })
            })
            // If there was no error, load up-to-date information on your account.
            .then(function () {
                return server.loadAccount(sourceKeys.publicKey());
            })
            .then(function (sourceAccount) {
                // Start building the transaction.
                console.log(sourceAccount)
                transaction = new StellarSdk.TransactionBuilder(sourceAccount)
                    .addOperation(StellarSdk.Operation.payment({
                        destination: destinationId,
                        asset: StellarSdk.Asset.native(),
                        amount: transactionReq.amount
                    }))
                    .addMemo(StellarSdk.Memo.text(transactionReq.memoText))
                    .setTimeout(1000)
                    .build();
                transaction.sign(sourceKeys);
                return server.submitTransaction(transaction);
            })
            .then(function (result) {
                console.log('Success! Results:', result);
                req.body.txnresponse = result;
                saveTransaction(req, res);
            })
            .catch(function (error) {
                console.error('Something went wrong!', error);
                res.json({
                    status: 400,
                    message: "Error occured",
                    error: err.message
                })
            });
    }
    catch (err) {
        res.json({
            status: 400,
            message: "Error occured",
            error: err.message
        })
    }
}

const saveTransaction = async (req, res) => {
    let txn = new transactionsClass(req.body);
    try {
        txn.sourceId = req.body.keyPair.publicKey;
        txn.transactionResult = req.body.txnresponse;
        let transaction = new transactionsModel(txn);
        let result = await transaction.save();
        if (result) {
            res.json({
                status: 200,
                message: "Transaction completed",
                data: result
            })
        }
    }
    catch (err) {
        res.json({
            status: 400,
            message: "Error occured",
            error: err.message
        })
    }
};


export { transactionsCtrl }