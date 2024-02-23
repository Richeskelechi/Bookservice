const { validateNewUser, validateUser } = require("../Validate/userValidate")
const { hashPassword, checkPassword, generateToken, formatResponse } = require("../Helpers/userHelper")
const User = require("../Models/Users")
const addANewUser = async (req, res) => {
    try {
        const { error } = validateNewUser(req.body)
        if (error) {
            return res.status(400).json({ status: 400, ok: false, message: error.details[0].message });
        }
        if (req.body.password != req.body.confirmPassword) {
            return res.status(400).json({ status: 400, ok: false, message: "Password do not match" });
        }
        const isExist = await User.findOne({ email: req.body.email })
        if (isExist) {
            return res.status(400).json({ status: 400, ok: false, message: "Email already exists" });
        }

        let newPassword = await hashPassword(req.body.password)
        req.body.password = newPassword
        const newUser = new User({
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            address: req.body.address,
        })
        await newUser.save()
        newUser.password = undefined
        return res.status(201).json({ status: 201, ok: true, message: "User Added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { error } = validateUser(req.body)
        if (error) {
            return res.status(400).json({ status: 400, ok: false, message: error.details[0].message });
        }
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ status: 400, ok: false, message: "User Not Found" });
        }
        if (user.status == 'Blocked') {
            return res.status(400).json({ status: 400, ok: false, message: "Account Blocked Please Contact The Admin" });
        }
        if (user.status == 'Deleted') {
            return res.status(400).json({ status: 400, ok: false, message: "Account Not Found" });
        }
        const isMatch = await checkPassword(req.body.password, user.password)
        if (!isMatch) {
            return res.status(400).json({ status: 400, ok: false, message: "Invalid Email Or Password" });
        }
        const token = generateToken(user.id, user.email)
        const response = formatResponse(user, token)
        return res.status(200).json({ status: 200, ok: true, message: { msg: "Login Successful", data: response } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }

}

const getUser = async (req, res) => {
    try {
        const id = req.params.id
        if(!id){
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A User Id" });
        }
        if(id != req.user.id){
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A Valid User Id" });
        }
        const user = await User.findById(id)
        if(!user){
            return res.status(400).json({ status: 400, ok: false, message: "User Not Found" });
        }
        user.password = undefined
        user.__v = undefined
        return res.status(200).json({ status: 200, ok: true, message: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        console.log(req.body);
        if(!id){
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A User Id" });
        }
        if(id != req.user.id){
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A Valid User Id" });
        }
        let user = await User.findById(id)
        if(!user){
            return res.status(400).json({ status: 400, ok: false, message: "User Not Found" });
        }
        let updatedUser = await User.findOneAndUpdate({_id: id},req.body,{
            new:true
        })
        return res.status(200).json({ status: 200, ok: true, message: updatedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        if(!id){
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A User Id" });
        }
        if(id != req.user.id){
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A Valid User Id" });
        }
        let user = await User.findById(id)
        if(!user){
            return res.status(400).json({ status: 400, ok: false, message: "User Not Found" });
        }
        await User.findOneAndUpdate({_id: id},{status: "Deleted"},{
            new:true
        })
        return res.status(200).json({ status: 200, ok: true, message: "Account Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

module.exports = { addANewUser, loginUser, getUser, updateUser, deleteUser }