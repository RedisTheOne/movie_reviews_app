const express = require('express');
const router = express.Router();
const jsonWebTokensKey = '$ga%@#31$@82@&$$@*$&_mami_jot_eshte_shume_hot_$%@#$@82$&@&$$aas@*';
const verifyToken = require('../verifyToken');
const jwt = require('jsonwebtoken');
const Save = require('../models/Save');

//Mund ti marresh saves tek /users/authenticate, spo krijojme route tejter ktu

//Add a save
router.post('/add', verifyToken, (req, res) => {
    if(req.body.movie_id) {
        jwt.verify(req.token, jsonWebTokensKey, (err, authData) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Token is not valid'
                }); 
            else {
                Save.findOne({movie_id: req.body.movie_id, user_id: authData.user._id})
                    .then(data => {
                        if(data)
                            res.json({status: false, msg: 'This movie is currently saved by this user'});
                        else {
                            new Save({
                                movie_id: req.body.movie_id,
                                user_id: authData.user._id
                            })
                                .save()
                                .then(save => res.json({status: true, msg: 'Movie saved', save}));
                        }
                    });
            }
        });
    } else 
        res.json({status: false, msg: 'Please fill required fields'});
});


//Remove Save
router.post('/remove', verifyToken, (req, res) => {
    if(req.body.movie_id) {
        jwt.verify(req.token, jsonWebTokensKey, (err, authData) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Token is not valid'
                }); 
            else {
                Save.deleteOne({movie_id: req.body.movie_id, user_id: authData.user._id})
                    .then(() => res.json({
                        status: true,
                        msg: 'Movie removed successfuly'
                    }));
            }
        });
    } else
        res.json({status: false, msg: 'Please fill required fields'});
});

module.exports = router;