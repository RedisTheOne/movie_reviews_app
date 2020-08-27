const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        const name = Date.now() + path.extname(file.originalname);
        req.fileName = name
      cb(null, name);
    }
})
const upload = multer({storage});

router.post('/add', upload.single('photo'), (req, res) => {
    console.log(req.body);
    if(req.file)
        res.json({status: true, msg: 'Image uploaded', data: req.fileName});
    else 
        res.json({status: false});
})

module.exports = router;