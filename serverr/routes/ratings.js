const express = require('express');
const router = express.Router();
const jsonWebTokensKey = '$ga%@#31$@82@&$$@*$&_mami_jot_eshte_shume_hot_$%@#$@82$&@&$$aas@*';
const verifyToken = require('../verifyToken');
const jwt = require('jsonwebtoken');
const Rating = require('../models/Rating');

//Rating qe ka 1 user i gjen tek /user/authenticate
//Sum Rating te 1 movie e gjen tek movies router

//Add Rating
router.post('/add', verifyToken, (req, res) => {
    if(req.body.value && req.body.movie_id) {
        jwt.verify(req.token, jsonWebTokensKey, (err, authData) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Token is not valid'
                }); 
            else {
                Rating.findOne({user_id: authData.user._id, movie_id: req.body.movie_id})
                    .then(data => {
                        if(data)
                            res.json({
                                status: false,
                                msg: 'This movie is already rated by this user'
                            });
                        else {
                            new Rating({
                                user_id: authData.user._id, 
                                movie_id: req.body.movie_id,
                                value: req.body.value,
                            })
                                .save()
                                .then(rating => res.json({
                                    status: true,
                                    msg: 'Rating added successfuly',
                                    rating
                                }));
                        }
                    });
            }
        });
    } else
        res.json({status: false, msg: 'Please fill required fields'});
});

//Remove Rating
router.post('/remove', verifyToken, (req, res) => {
    if(req.body.movie_id) {
        jwt.verify(req.token, jsonWebTokensKey, (err, authData) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Token is not valid'
                }); 
            else {
                Rating
                    .deleteOne({user_id: authData.user._id, movie_id: req.body.movie_id})
                    .then(() => res.json({
                        status: true,
                        msg: 'Rating removed successfuly'
                    }));
            }
        });
    } else
        res.json({status: false, msg: 'Please fill required fields'});
});

//Edit Rating
router.post('/edit/:rating_id', verifyToken, (req, res) => {
    if(req.body.value) {
        jwt.verify(req.token, jsonWebTokensKey, (err, authData) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Token is not valid'
                }); 
            else {
                Rating
                    .findOne({_id: req.params.rating_id})
                    .then(data => {
                        if(data.user_id === authData.user._id) {
                            Rating
                                .updateOne({_id: req.params.rating_id}, {value: req.body.value})
                                .then(() => res.json({status: true, msg: 'Rating updated'}))
                        } else
                            res.json({status: false, msg: 'Not authenticated move :)'});
                    })
                    .catch(() => res.json({status: false, msg: 'Rating not found'}))
            }  
        });
    } else
        res.json({status: false, msg: 'Please fill required fields'});
});

module.exports = router;