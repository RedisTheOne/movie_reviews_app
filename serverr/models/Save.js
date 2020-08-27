const mongoose = require('mongoose');

const schema = mongoose.Schema({
    movie_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
});

const Schema = mongoose.model('Save', schema);
module.exports = Schema; 