const bcrypt = require('bcrypt');
const pass = "123456789";
const salt = 5;

bcrypt.hash(pass, salt, (err, enc) => {
    bcrypt.compare(pass, enc, (err, result) => {
        console.log(result);
    });
});