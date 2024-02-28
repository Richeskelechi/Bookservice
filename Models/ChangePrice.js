const mongoose = require('mongoose');
const Schema = mongoose.Schema

const changePriceSchema = new Schema({
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
    bookId: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        trim: true,
        default: "Pending"
    }
}, { timestamps: true });
const ChangePrice = mongoose.model('ChangePrice', changePriceSchema)
module.exports = ChangePrice