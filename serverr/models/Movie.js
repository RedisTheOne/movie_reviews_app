const mongoose = require('mongoose');

const schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    image_path: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    views: {
        type: Number,
        required: true
    }
});

const Schema = mongoose.model('Movie', schema);
module.exports = Schema; 