const jwt = require('jsonwebtoken');
const User = require("../Models/Users")
const Admin = require("../Models/Admin")

const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ msg: "Please Pass the authorization Token" });
        }
        const token = req.headers.authorization.split(" ")[1]
        if (token || token != undefined) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (decoded.id && decoded.email) {
                const user = await User.findById(decoded.id)
                if (user) {
                    if (user.status == 'Blocked') {
                        return res.status(400).json({ msg: "Account Blocked Please Contact The Admin" })
                    } else if (user.status == 'Deleted') {
                        return res.status(400).json({ msg: "Account Not Found" })
                    } else {
                        req.user = user
                        next()
                    }
                } else {
                    return res.status(401).json({ msg: "Please Pass a valid authorization token" })
                }
            } else {
                return res.status(401).json({ msg: "Please Pass a valid authorization token" })
            }
        } else {
            return res.status(401).json({ msg: "Please Pass a valid authorization token" })
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: "User Not Authenticated" })
    }
}

const verifyAdminToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ msg: "Please Pass the authorization Token" });
        }
        const token = req.headers.authorization.split(" ")[1]
        if (token || token != undefined) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (decoded.id && decoded.email) {
                const admin = await Admin.findById(decoded.id)
                if (admin) {
                    if (admin.status == 'Blocked') {
                        return res.status(400).json({ msg: "Admin Account Blocked Please Contact The Super Admin" })
                    } else if (admin.status == 'Deleted') {
                        return res.status(400).json({ msg: "Account Not Found." })
                    } else {
                        req.user = admin
                        next()
                    }
                } else {
                    return res.status(401).json({ msg: "Please Pass a valid authorization token" })
                }
            } else {
                return res.status(401).json({ msg: "Please Pass a valid authorization token" })
            }
        } else {
            return res.status(401).json({ msg: "Please Pass a valid authorization token" })
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: "Admin Not Authenticated" })
    }
}

const verifySuperAdminToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ msg: "Please Pass the authorization Token" });
        }
        const token = req.headers.authorization.split(" ")[1]
        if (token || token != undefined) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (decoded.id && decoded.email) {
                const admin = await Admin.findById(decoded.id)
                if (admin) {
                    if (admin.status == 'Blocked') {
                        return res.status(400).json({ msg: "Admin Account Blocked Please Contact The Super Admin" })
                    } else if (admin.status == 'Deleted') {
                        return res.status(400).json({ msg: "Account Not Found." })
                    }else if(admin.role != 'super'){
                        return res.status(400).json({ msg: "Sorry You Do Not Have The Required Access To Perform This Operation" })
                    } else {
                        req.user = admin
                        next()
                    }
                } else {
                    return res.status(401).json({ msg: "Please Pass a valid authorization token" })
                }
            } else {
                return res.status(401).json({ msg: "Please Pass a valid authorization token" })
            }
        } else {
            return res.status(401).json({ msg: "Please Pass a valid authorization token" })
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: "Admin Not Authenticated" })
    }
}

module.exports = { verifyToken, verifyAdminToken, verifySuperAdminToken }