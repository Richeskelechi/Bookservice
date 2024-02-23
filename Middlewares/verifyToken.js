const jwt = require('jsonwebtoken');
const User = require("../Models/Users")

const verifyToken = async (req, res, next) => {
    try {
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

module.exports = { verifyToken }