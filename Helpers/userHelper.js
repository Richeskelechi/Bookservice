const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
function hashPassword(password){
    return bcrypt.hash(password, +process.env.SALT_ROUND)
}

function checkPassword(givenPassword, savedPassword){
    return bcrypt.compare(givenPassword, savedPassword)
}

function generateToken(userId, email){
    return jwt.sign({id: userId, email: email},process.env.JWT_SECRET,{expiresIn: '1h'})
}

function formatResponse(user, token){
    return {
        email: user.email,
        id: user.id,
        token: token
    }
}

module.exports = { hashPassword, checkPassword, generateToken, formatResponse }