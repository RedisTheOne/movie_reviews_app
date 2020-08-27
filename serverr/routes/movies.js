const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');

//Get latests movie reviews
router.get('/:limit', async(req, res) => {
    Movie
        .find({})
        .sort({createdAt: -1})
        .limit(parseInt(req.params.limit))
        .then((data) => {
            const finalData = data.map(async (d) => {
                let ratingSum = 0;
                let movieRatings = 0;
                let rating = 0;
                let data = {};
                const ratings = await Rating.find({movie_id: d._id});
                ratings.forEach(r => {
                    ratingSum += r.value;
                    movieRatings++;
                });
                if(movieRatings !== 0)
                    rating = ratingSum / movieRatings;
                data = {
                    createdAt: d.createdAt,
                    _id: d._id,
                    title: d.title,
                    image_path: d.image_path,
                    genre: d.genre,
                    year: d.year,
                    ratings_sum: rating,
                    views: d.views
                };
                return data;
            });
            Promise
                .all(finalData)
                .then(completed => {
                    res.json(completed);
                });
        });
});

//Get most viewed revies
router.get('/mostviewed/:limit', (req, res) => {
    Movie
        .find({})
        .sort({views: -1})
        .limit(parseInt(req.params.limit))
        .then(data => {
            res.json(data);
        });
});

function validIfAdmin(req, res, next) {
    if(req.body.user === 'admin' && req.body.password === 'dsdk2@#rfafkkfll#$2$@#$$') {
        next();
    } else 
        res.json({status: false, msg: 'Not authorized move'});
}

//Add a moview review
router.post('/add', validIfAdmin, (req, res) => {
    if(req.body.title && req.body.review && req.body.genre && req.body.year && req.body.fileName) {
        const movie = new Movie({
            title: req.body.title,
            review: req.body.review,
            image_path: `/${req.body.fileName}`,
            genre: req.body.genre,
            year: req.body.year,
            views: 0
        });
        movie.save()
            .then(data => {
                res.json({status: true, msg: 'Review created', data});
            });
    } else
        res.json({status: false, msg: 'Please enter required fields'});
});

//Get Single Movie
router.get('/single/:id', (req, res) => {
    Movie.findOne({_id: req.params.id})
        .then(d => {
            let ratingSum = 0;
            let movieRatings = 0;
            let rating = 0;
            Rating.find({movie_id: d._id})
                .then(ratings => {
                    ratings.forEach(r => {
                        ratingSum += r.value;
                        movieRatings++;
                    });
                    if(movieRatings !== 0)
                        rating = ratingSum / movieRatings;

                    //Find comments
                    Comment.find({movie_id: req.params.id})
                        .then(comments => {
                            //Update Views
                            Movie.update({_id: req.params.id}, { $inc: { views: 1 } })
                                .then(() => {
                                    //Send data to user
                                    res.json({
                                        status: true, 
                                        data: {
                                            createdAt: d.createdAt,
                                            _id: d._id,
                                            title: d.title,
                                            image_path: d.image_path,
                                            genre: d.genre,
                                            year: d.year,
                                            ratings_sum: rating,
                                            review: d.review,
                                            views: d.views + 1,
                                            comments
                                        }
                                    });
                                });
                        });
                });  
        })
        .catch(() => res.json({status: false, msg: 'Movie not found'}));
});

//Search a movie
router.get('/search/:search_key', (req, res) => {
    const re = new RegExp("^" + req.params.search_key);
    Movie
        .find({'title': re})
        .sort({createdAt: -1})
        .then(data => res.json(data));
});

module.exports = router;