
const express = require('express');
const cors = require('cors');
const app = express();

const whiteList = ['http://localhost:8080', 'https://localhost:8523'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin:true };
    }
    else{
        corsOptions = { origin:false };
    }
    callback(null, corsOptions);
};

module.exports.cors = cors();
module.exports.corsWithOptions = cors(corsOptionsDelegate);