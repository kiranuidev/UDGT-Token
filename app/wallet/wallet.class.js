export default class walletClass{
    constructor(request){
        this.emailId = request.emailId;
        this.keyPair = request.keyPair;
        this.responseJson = request.responseJson;
        this.publicKey = request.publicKey;
    }
}