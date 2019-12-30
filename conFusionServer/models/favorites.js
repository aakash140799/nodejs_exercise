
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteDishSchema = new Schema({
    dishid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
});
const favoriteSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    favorites: [favoriteDishSchema]
});

const favoriteModel = mongoose.model('Favorite', favoriteSchema);
module.exports = favoriteModel;