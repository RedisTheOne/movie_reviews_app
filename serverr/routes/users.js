const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Save = require('../models/Save');
const bcrypt = require('bcrypt');
const salt = 5;
const jsonWebTokensKey = '$ga%@#31$@82@&$$@*$&_mami_jot_eshte_shume_hot_$%@#$@82$&@&$$aas@*';
const verifyToken = require('../verifyToken');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');


//User Sign In
router.post('/signin', (req, res) => {
    if(req.body.username && req.body.password) {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({username})
            .then(data => {
                if(data) {
                    //Check if password is valid
                    bcrypt.compare(password, data.password, (err, result) => {
                        if(result) {
                            //Create Token And Send It
                            jwt.sign({user: data}, jsonWebTokensKey, {expiresIn: '30d'}, (err, token) => {
                                res.json({status: true, token});
                            });
                        } else
                            res.json({status: false, msg: 'Password is not correct'});
                    });
                } else
                    res.json({status: false, msg: 'User is invalid'});
            }); 
    } else
        res.json({status: false, msg: 'Please enter required fields'});
});

//User Sign Up
router.post('/signup', (req, res) => {
    if(req.body.username && req.body.password && req.body.email) {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        //Check if a user exists with this username
        User.findOne({username})
            .then(data => {
                if(data) 
                    res.json({status: false, msg: 'A user with this username already exists'});
                else {
                    //Create the new user
                    let user = new User();
                    bcrypt.hash(password, salt, (err, encrypted) => {
                        user.password = encrypted;
                        user.username = username;
                        user.email = email;
                        user.save()
                            .then(data => {
                                //Create Token And Send It
                                jwt.sign({user: data}, jsonWebTokensKey, {expiresIn: '30d'}, (err, token) => {
                                    res.json({status: true, token});
                                });
                            });
                    });
                }
            });
    } else
        res.json({status: false, msg: 'Please enter required fields'});
});

//Get User Information
router.get('/authenticate', verifyToken, (req, res) => {
    jwt.verify(req.token, jsonWebTokensKey, (err, authData) => {
        if(err)
            res.json({
                status: false,
                msg: 'Token is not valid'
            });
        else {
            //Get Saves
            Save.find({user_id: authData.user._id})
                .then(saves => {
                    //Get Ratings
                    Rating.find({user_id: authData.user._id})
                        .then(ratings => {
                            //Get Comments
                            Comment.find({username: authData.user.username})
                                .then(comments => {
                                    res.json({
                                        status: true,
                                        username: authData.user.username, 
                                        email: authData.user.email,
                                        _id: authData.user._id, 
                                        saves,
                                        ratings,
                                        comments
                                    });
                                });
                        })
                });
        }
    });
});

module.exports = router;