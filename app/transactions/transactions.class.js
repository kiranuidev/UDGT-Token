export default class transactions{
    constructor(request){
        this.sourceId = request.sourceId;
        this.destinationId = request.destinationId;
        this.assetType = request.assetType;
        this.memoText = request.memoText;
        this.amount = request.amount;
        this.transactionResult = request.transactionResult;
    }
}