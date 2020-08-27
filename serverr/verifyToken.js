function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader;
        req.token = bearerToken.split('Bearer ')[1];
        next();
    } else {
        res.json({status: false, msg: 'Token is not valid'});
    }
}

module.exports = verifyToken;