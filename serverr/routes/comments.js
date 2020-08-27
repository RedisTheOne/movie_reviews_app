const express = require('express');
const router = express.Router();
const jsonWebTokensKey = '$ga%@#31$@82@&$$@*$&_mami_jot_eshte_shume_hot_$%@#$@82$&@&$$aas@*';
const verifyToken = require('../verifyToken');
const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment');

//Add Comment
router.post('/add', verifyToken, (req, res) => {
    if(req.body.comment && req.body.movie_id) {
        jwt.verify(req.token, jsonWebTokensKey, (err, authData) => {
            if(err)
                res.json({status: false, msg: 'Token is not valid'});
            else {
                new Comment({
                    comment: req.body.comment,
                    username: authData.user.username,
                    movie_id: req.body.movie_id
                })
                    .save()
                    .then(comment => res.json({
                        status: true,
                        msg: 'Comment added successfuly',
                        comment
                    }));
            }
        });
    } else
        res.json({
            status: false,
            msg: 'Please fill required fields'
        });
});

//Remove Comment
router.post('/remove/:comment_id', verifyToken, (req, res) => {
    jwt.verify(req.token, jsonWebTokensKey, (err, authData) => {
        if(err)
            res.json({status: false, msg: 'Token is not valid'});
        else {
            Comment.find({_id: req.params.comment_id, username: authData.user.username})
                .then(comment => {
                    if(comment) {
                        Comment.deleteOne({_id: req.params.comment_id})
                            .then(() => res.json({status: true, msg: 'Comment deleted successfuly'}));
                    } else 
                        res.json({status: false, msg: 'Token is not valid'});
                })
                .catch(() => {
                    res.json({
                        status: false,
                        msg: 'Couldn\'t remove comment'
                    })
                });
        }
    });
});

//Edit Comment
router.post('/edit/:comment_id', verifyToken, (req, res) => {
    if(req.body.comment) {
        jwt.verify(req.token, jsonWebTokensKey, (err, authData) => {
            if(err)
                res.json({status: false, msg: 'Token is not valid'});
            else {
                Comment.find({_id: req.params.comment_id, username: authData.user.username})
                    .then(comment => {
                        if(comment) {
                            Comment.updateOne({_id: req.params.comment_id}, {comment: req.body.comment})
                                .then(() => res.json({status: true, msg: 'Comment edited successfuly'}));
                        } else 
                            res.json({status: false, msg: 'Token is not valid'});
                    })
                    .catch(() => {
                        res.json({
                            status: false,
                            msg: 'Couldn\'t edit comment'
                        })
                    });
            }
        });
    } else
        res.json({
            status: false,
            msg: 'Please fill required fields'
        });
});

module.exports = router;