const mongoose = require('mongoose');
const Schema = mongoose.Schema

const adminSchema = new Schema({
    firstName:{
        type: String,
        trim: true,
        required:true,
    },
    lastName:{
        type: String,
        trim: true,
        required:true,
    },
    email:{
        type: String,
        trim: true,
        required:true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        trim: true,
        required:true,
    },
    role:{
        type: String,
        trim: true,
        required:true,
        default: 'normal',
    },
    status:{
        type: String,
        trim: true,
        default:"Active"
    }
},{timestamps:true});
const Admin = mongoose.model('Admin',adminSchema)
module.exports = Admin