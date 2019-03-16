import mongoose from 'mongoose';
import {dbConfig} from './env/development';

export default async()=>{
    await mongoose.connect(dbConfig.db, { useNewUrlParser: true }, (err,conn)=>{
        if(err){
            console.log("Error in DB connection:", err.message);
        }else{
            console.log("Connected to DB");
        }
    })
    let db = mongoose.Connection;
    return db;
}