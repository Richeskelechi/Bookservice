const Joi = require('joi');

function validateNewUser(user) {
    const schema = Joi.object({
        userName: Joi.string().alphanum().min(3).max(30).required(),
        firstName: Joi.string().alphanum().min(3).max(30).required(),
        lastName: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        confirmPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        phoneNumber: Joi.string().required(),
        address: Joi.string().required()
    })
    return schema.validate(user)
}

function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    })
    return schema.validate(user)
}

module.exports = { validateNewUser, validateUser }