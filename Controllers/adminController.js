const { validateNewAdmin, validateAdmin } = require("../Validate/adminValidate")
const { hashPassword, checkPassword, generateAdminToken, formatResponse, formatAdminResponse } = require("../Helpers/userHelper")
const Admin = require("../Models/Admin")
const User = require("../Models/Users")
const ChangePrice = require("../Models/ChangePrice")
const Book = require("../Models/Books")

const addANewAdmin = async (req, res) => {
    try {
        const { error } = validateNewAdmin(req.body)
        if (error) {
            return res.status(400).json({ status: 400, ok: false, message: error.details[0].message });
        }
        if (req.body.password != req.body.confirmPassword) {
            return res.status(400).json({ status: 400, ok: false, message: "Password do not match" });
        }
        const isExist = await Admin.findOne({ email: req.body.email })
        if (isExist) {
            return res.status(400).json({ status: 400, ok: false, message: "Email already exists" });
        }

        let newPassword = await hashPassword(req.body.password)
        req.body.password = newPassword
        const newAdmin = new Admin({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        })
        await newAdmin.save()
        return res.status(201).json({ status: 201, ok: true, message: "Admin Created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { error } = validateAdmin(req.body)
        if (error) {
            return res.status(400).json({ status: 400, ok: false, message: error.details[0].message });
        }
        const admin = await Admin.findOne({ email: req.body.email })
        if (!admin) {
            return res.status(400).json({ status: 400, ok: false, message: "User Not Found" });
        }
        if (admin.status == 'Blocked') {
            return res.status(400).json({ status: 400, ok: false, message: "Admin Account Blocked Please Contact The Super Admin" });
        }
        if (admin.status == 'Deleted') {
            return res.status(400).json({ status: 400, ok: false, message: "Account Not Found" });
        }
        const isMatch = await checkPassword(req.body.password, admin.password)
        if (!isMatch) {
            return res.status(400).json({ status: 400, ok: false, message: "Invalid Email Or Password" });
        }
        const token = generateAdminToken(admin.id, admin.email, admin.role)
        const response = formatAdminResponse(admin, token)
        return res.status(200).json({ status: 200, ok: true, message: { msg: "Login Successful", data: response } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const getAllUser = async (req, res) => {
    try {
        const user = await User.find()
        return res.status(200).json({ status: 200, ok: true, message: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const getAUser = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A User Id" });
        }
        const user = await User.findById(id)
        if (!user) {
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

const changeAUserStatus = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A User Id" });
        }
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({ status: 400, ok: false, message: "User Not Found" });
        }
        if (user.status == 'Blocked') {
            user.status = 'Active'
        } else if (user.status == 'Active') {
            user.status = 'Blocked'
        } else {
            return res.status(400).json({ status: 400, ok: false, message: "User Already Deleted" });
        }
        await user.save();
        return res.status(200).json({ status: 200, ok: true, message: "Status Changed" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const deleteAUser = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A User Id" });
        }
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({ status: 400, ok: false, message: "User Not Found" });
        }
        if (user.status == 'Deleted') {
            return res.status(400).json({ status: 400, ok: false, message: "User Already Deleted" });
        }
        user.status = 'Deleted'
        await user.save();
        return res.status(200).json({ status: 200, ok: true, message: "User Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const getAllPrice = async (req, res) => {
    try {
        const prices = await ChangePrice.find()
        return res.status(200).json({ status: 200, ok: true, message: prices });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const acceptPriceChange = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A Price id" });
        }
        const price = await ChangePrice.findById(id)
        if (!price) {
            return res.status(400).json({ status: 400, ok: false, message: "Price Not Found" });
        }
        if (price.status == 'Rejected') {
            return res.status(400).json({ status: 400, ok: false, message: "Price Change Already Rejected" });
        } else if (price.status == 'Accepted') {
            return res.status(400).json({ status: 400, ok: false, message: "Price Chnage Already Accepted" });
        } else {
            const book = await Book.findOne({ _id: price.bookId });
            if (!book) {
                return res.status(404).json({ status: 404, ok: false, message: "Book To Change Price Not Found" });
            }
            book.price = price.price
            price.status = "Accepted"
            await price.save();
            await book.save();
            return res.status(200).json({ status: 200, ok: true, message: "Price Change Accepted" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const rejectPriceChange = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A Price id" });
        }
        const price = await ChangePrice.findById(id)
        if (!price) {
            return res.status(400).json({ status: 400, ok: false, message: "Price Not Found" });
        }
        if (price.status == 'Rejected') {
            return res.status(400).json({ status: 400, ok: false, message: "Price Change Already Rejected" });
        } else if (price.status == 'Accepted') {
            return res.status(400).json({ status: 400, ok: false, message: "Price Chnage Already Accepted" });
        } else {
            const book = await Book.findOne({ _id: price.bookId });
            if (!book) {
                return res.status(404).json({ status: 404, ok: false, message: "Book To Change Price Not Found" });
            }
            book.price = price.price
            price.status = "Rejected"
            await price.save();
            await book.save();
            return res.status(200).json({ status: 200, ok: true, message: "Price Change Rejected" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

module.exports = { addANewAdmin, loginAdmin, getAllUser, getAUser, changeAUserStatus, deleteAUser, getAllPrice, acceptPriceChange, rejectPriceChange }