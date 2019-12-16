
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./Operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url,(err, client) => {
    assert.equal(err, null);
    console.log("connected");

    const db = client.db(dbname);
    dboper.insertDocument(db, {name:'Valnut', description:'Test'}, 'dishes', (result) => {
        console.log("inserted\n", result.result);

        dboper.findDocuments(db, 'dishes', (result) => {
            console.log("found\n", result);

            dboper.updateDocument(db, {name:'Valnut'}, {description:'Updated Test'}, 'dishes', (result) => {
                console.log("updated ",result.result);

                dboper.findDocuments(db, 'dishes', (result) => {
                    console.log("found\n", result);

                    db.dropCollection('dishes', (err, result) => {
                        assert.equal(err, null);

                        client.close();
                    });
                });
            });
        });
    });
});