const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    movie_id: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

const Schema = mongoose.model('Rating', schema);
module.exports = Schema; 