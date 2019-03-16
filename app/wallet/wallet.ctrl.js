import { default as walletModel } from './wallet.model';
import { default as walletClass } from './wallet.class';
import { stellarSdkInfo } from '../../config/env/development';
import * as StellarSdk from 'stellar-sdk';
import fetch from 'node-fetch'
let walletCtrl = {};

walletCtrl.checkUserExists = async(req, res, next)=>{
    let user = new walletClass(req.body);
    try{
        let result = await walletModel.findOne({emailId:user.emailId}).exec();
        if(result){
            res.json({
                status:205,
                message:"Wallet exists for this user"
            })
        }
        else{
            next();
        }
    }
    catch(e){
        res.json({
            status: 400,
            message: "Error occured",
            error: e.message
        })
    }
}

walletCtrl.createKeyPair = async (req, res) => {
    let walletAcc = new walletClass(req.body);
    if (walletAcc.emailId) {
        try {
            const pair = StellarSdk.Keypair.random();
            const response = await fetch(
                `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
            );
            const responseJson = await response.json();
            console.log("SUCCESS! You have a new account :)\n", responseJson);
            walletAcc.keyPair = {
                publicKey: pair.publicKey(),
                secret: pair.secret()
            }
            walletAcc.responseJson = responseJson;
            let walletAccount = new walletModel(walletAcc);
            let result = await walletAccount.save();
            console.log(result);
            if (result) {
                res.json({
                    status: 200,
                    message: "Wallet created",
                    data: {
                        emailId: result.emailId,
                        publicKey: result.keyPair.publicKey
                    }
                })
            }
        } catch (e) {
            console.error("ERROR!", e);
            res.json({
                status: 400,
                message: "Error occured",
                error: e.message
            })
        }
    }
    else {
        res.json({
            status: 400,
            message: "Please enter email"
        })
    }
}

walletCtrl.getBalances = async (req, res) => {
    let walletAcc = new walletClass(req.body);
    try {
        const server = new StellarSdk.Server(stellarSdkInfo.server);
        const account = await server.loadAccount(walletAcc.publicKey);
        console.log("Balances for account: " + walletAcc.publicKey);
        account.balances.forEach(function (balance) {
            console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
        });
        res.json({
            status:200,
            message:"success",
            data: account.balances
        })
    }
    catch (err) {
        res.json({
            status: 400,
            message: "Error occured",
            error: err.message
        })
    }
}

walletCtrl.getWalletInfo = async (req, res, next) => {
    let walletAcc = new walletClass(req.body);
    try {
        let result = await walletModel.findOne({emailId:walletAcc.emailId}).exec();
        console.log(result);
        if(result){
            if(req.url == '/udgt/api/getWalletInfo'){
                res.json({
                    status:200,
                    message:"success",
                    data:result
                })
            }
            else{
                req.body.keyPair = result.keyPair;
                next();
            }
        }
        else{
            res.json({
                status:404,
                message:"User not found"
            })
        }
    }
    catch (err) {
        res.json({
            status:400,
            message:"Error occured",
            error: err.message
        })
    }
}

export { walletCtrl }