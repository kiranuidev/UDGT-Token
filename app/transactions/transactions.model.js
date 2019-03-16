import mongoose from 'mongoose';
let schema = mongoose.Schema;

let transactionsSchema = new schema({
    sourceId:{
        type:String
    },
    destinationId:{
        type:String
    },
    assetType:{
        type:String
    },
    memoText:{
        type:String
    },
    amount:{
        type:String
    },
    transactionResult:{
        type:Object
    }
})

export default mongoose.model('Transactions', transactionsSchema)