
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./Operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url).then((client) => {
    console.log("connected");

    const db = client.db(dbname);
    dboper.insertDocument(db, {name:'Valnut', description:'Test'}, 'dishes')
    .then((result) => {
        console.log("inserted\n", result.result);

        return dboper.findDocuments(db, 'dishes');
    })
    .then((result) => {
        console.log("found\n", result);

        return dboper.updateDocument(db, {name:'Valnut'}, {description:'Updated Test'}, 'dishes');
    })
    .then((result) => {
        console.log("updated ",result.result);

        return dboper.findDocuments(db, 'dishes');
    })
    .then((result) => {
        console.log("found\n", result);

        return db.dropCollection('dishes');
    })
    .then((result) => {
        
        client.close();
    })
    .catch((err) => {
        console.log(err);
    });
})
.catch((err) => {
    console.log(err);
});