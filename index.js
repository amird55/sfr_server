//npm i express mysql2 body-parser
process.env.TZ = "Asia/Jerusalem";

const express = require('express');

const port = 6127;
const app = express();
app.use(express.json());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const path = require('path');

//--- mysql db-----
let db_M = require('./database');
global.db_pool = db_M.pool;


app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port http://localhost:${port}`);
});
