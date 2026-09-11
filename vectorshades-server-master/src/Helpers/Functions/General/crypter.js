const { hash, compare } = require('bcrypt');

const isPasswordHashed = (password) => {
    return typeof password === 'string' && /^\$2[aby]\$/.test(password);
}

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

const validatePassword = async (plainPassword, storedPassword) => {
    if (isPasswordHashed(storedPassword)) {
        return comparePassword(plainPassword, storedPassword);
    }
    return plainPassword === storedPassword;
}

module.exports = { encryptPassword, comparePassword, isPasswordHashed, validatePassword }