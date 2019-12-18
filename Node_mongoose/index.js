
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('connected');

    const dish = new Dishes({
        name: 'Uthappizza',
        description: 'test'
    });

    dish.save()
    .then((result) => {
        console.log(result);

        return Dishes.find({});
    })
    .then((result) => {
        console.log(result);

        return Dishes.remove({});
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
    
});
