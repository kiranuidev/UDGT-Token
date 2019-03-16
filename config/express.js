import express from 'express';
import bodyParser from 'body-parser';
import {default as walletRoutes} from '../app/wallet/wallet.routes';
import {default as transactionRoutes} from '../app/transactions/transactions.routes';

export default () => {
    let app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use("/", walletRoutes);
    app.use("/", transactionRoutes);

    return app;
}
