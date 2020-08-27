const mongoose = require('mongoose');

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const Schema = mongoose.model('User', schema);
module.exports = Schema; 