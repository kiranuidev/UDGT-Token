import mongoose from 'mongoose';
let schema = mongoose.Schema;

let walletAccountSchema = new schema({
    emailId:{
        type:String,
        required:true,
        unique:true,
        match: /\S+@\S+\.\S+/
    },
    keyPair:{
        secret:{
            type:String
        },
        publicKey:{
            type:String
        }
    },
    responseJson:{
        type:Object
    }
})
export default mongoose.model('Wallet', walletAccountSchema);


