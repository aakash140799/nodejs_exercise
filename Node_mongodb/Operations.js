

const assert = require('assert');
module.exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.insertOne(document, (err, result) => {
        assert.equal(err, null);
        console.log("Inserted "+result.result.n+" objects in collection");
        callback(result);
    });
};

module.exports.findDocuments = (db, collection, callback) => {
    const coll = db.collection(collection);
    coll.find({}).toArray((err, result) => {
        assert.equal(err, null);
        callback(result);
    });
};

module.exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.deleteOne(document, (err, result) => {
        assert.equal(err, null);
        callback(result);
    });
};

module.exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    coll.updateOne(document, {$set: update}, null, (err, result) => {
        assert.equal(err, null);
        console.log("update the document with ", update);
        callback(result);
    });
};