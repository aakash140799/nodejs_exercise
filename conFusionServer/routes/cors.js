
const express = require('express');
const cors = require('cors');
const app = express();

const whiteList = ['http://localhost:8080', 'https://localhost:8523'];
var corsOptions = {
    origin : (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1){
            callback(null, true);
        }
        else{
            callback(new Error('Not allowed by CORS'), false);
        }
    }
};

module.exports.cors = cors();
module.exports.corsWithOptions = cors(corsOptions);