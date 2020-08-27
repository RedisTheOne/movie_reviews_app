const mongoose = require('mongoose');

const schema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    movie_id: {
        type: String,
        required: true
    }
});

const Schema = mongoose.model('Comment', schema);
module.exports = Schema; 