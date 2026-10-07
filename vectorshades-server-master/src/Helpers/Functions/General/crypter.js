const {genSalt, hash, compare} = require('bcrypt');

const encryptPassword = async (password) => {
    return new Promise((r, j) => {

        hash(password, 10, function(err, hash) {
            if (err) {
                j(err);
                return
            }
            r(hash)
        });
    })
}

const comparePassword = async (password, hash) => {
    return new Promise((r, j) => {
        compare(password, hash, (err,result) => {
            if (err) {
                j(err);
                return
            }
            r(result)
        })
    })
}

module.exports = {encryptPassword, comparePassword}