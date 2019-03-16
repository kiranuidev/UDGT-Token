import express from 'express';
import {walletCtrl} from './wallet.ctrl';

let router = express.Router();

//TO create KeyPair
router.post('/udgt/api/createKeyPair', walletCtrl.checkUserExists, walletCtrl.createKeyPair);

//TO get Balances for a KeyPair
router.post('/udgt/api/getBalances', walletCtrl.getBalances)

//To get the Wallet Info
router.post('/udgt/api/getWalletInfo', walletCtrl.getWalletInfo);

export default router;



