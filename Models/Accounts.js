const mongoose = require('mongoose');
const Schema = mongoose.Schema

const accountSchema = new Schema({
    email:{
        type: String,
        trim: true,
        required:true,
        unique: true,
        lowercase: true,
    },
    userId:{
        type: String,
        required: true,
        unique: true,
    },
    amount:{
        type: Number,
        default: 100
    }
},{timestamps:true});
const Account = mongoose.model('Account', accountSchema)
module.exports = Account