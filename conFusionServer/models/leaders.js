
const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Schema = mongoose.Schema;
const currency = mongoose.Types.currency;

const leaderSchema = Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const leaderModel = mongoose.model('Leader', leaderSchema);

module.exports = leaderModel;