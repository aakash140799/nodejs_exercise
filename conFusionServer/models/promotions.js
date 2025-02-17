
const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const promoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        min: 0,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const promoModel = mongoose.model('Promotion', promoSchema);

module.exports = promoModel;