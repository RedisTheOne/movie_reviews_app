const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer();

//DB Config
mongoose.connect('mongodb+srv://redus:redis06122002!@cluster0-xwsm9.mongodb.net/moviesReviews?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes
app.use('/public', express.static('./images'));
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));
app.use('/images', require('./routes/images'));
app.use('/saves', require('./routes/saves'));
app.use('/ratings', require('./routes/ratings'));
app.use('/comments', require('./routes/comments'));

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));