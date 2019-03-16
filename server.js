import {dbConfig} from './config/env/development';
import { default as express} from './config/express';
import {default as mongoose} from './config/mongoose';

const app = express();
const db = mongoose();

global.appRoot = require('path').resolve(__dirname);
console.log(appRoot);

app.listen( dbConfig.port, ()=>{
    console.log("Server listening to port:", dbConfig.port);
})

export {app};