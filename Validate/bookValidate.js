const Joi = require('joi');

function validateNewBook(book) {
    const schema = Joi.object({
        bookName: Joi.string().min(3).max(50).required(),
        bookAuthor: Joi.string().min(3).max(50).required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
    })
    return schema.validate(book)
}

function validateChangeBookPrice(book) {
    const schema = Joi.object({
        description: Joi.string().min(3).max(2000).required(),
        bookId: Joi.string().min(3).max(200).required(),
        price: Joi.number().required(),
    })
    return schema.validate(book)
}

module.exports = { validateNewBook, validateChangeBookPrice }