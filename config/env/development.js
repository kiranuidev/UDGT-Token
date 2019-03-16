let port = process.env.PORT || 3001;
export const dbConfig = {
    port:port,
    secret:"UDGT",
    //db:"mongodb://localhost:27017/StellarWallet"
    db:"mongodb://udgt:udgt123@ds163905.mlab.com:63905/udgt"
} 

export const stellarSdkInfo = {
    server:"https://horizon-testnet.stellar.org"
}