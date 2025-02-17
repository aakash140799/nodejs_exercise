 
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const imageFileFilter = (req, file, callback) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)/)){
        return callback(new Error('You can upload only image files'), false);
    }
    else{
        callback(null, true);
    }
};

const upload = multer({storage:storage, fileFilter:imageFileFilter});

var uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation is not supported on /imageUpload");
})
.post(cors.corsWithOptions, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /imageUpload");
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE operation is not supported on /imageUpload");
});

module.exports = uploadRouter;