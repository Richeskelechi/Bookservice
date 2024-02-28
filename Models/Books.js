const mongoose = require('mongoose');
const Schema = mongoose.Schema

const bookSchema = new Schema({
    email:{
        type: String,
        trim: true,
        required:true,
        lowercase: true,
    },
    userId:{
        type: String,
        required: true,
    },
    bookName: {
        type: String,
        trim: true,
        required: true,
    },
    bookAuthor: {
        type: String,
        trim: true,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        trim: true,
        default: "Pending"
    }
}, { timestamps: true });
const Book = mongoose.model('Book', bookSchema)
module.exports = Book