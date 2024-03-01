const express = require('express');
const adminRouter = express.Router();
const { addANewAdmin, loginAdmin, getAllUser, getAUser, changeAUserStatus, deleteAUser, getAllPrice, acceptPriceChange, rejectPriceChange } = require("../Controllers/adminController")

const { verifyAdminToken, verifySuperAdminToken } = require("../Middlewares/verifyToken")

adminRouter.post("/",verifySuperAdminToken, addANewAdmin)
adminRouter.post("/login", loginAdmin)
adminRouter.get("/getAllUsers", verifyAdminToken, getAllUser)
adminRouter.get("/getAllUsers/:id", verifyAdminToken, getAUser)
adminRouter.put("/changeStatus/:id", verifyAdminToken, changeAUserStatus)
adminRouter.delete("/deleteUser/:id", verifySuperAdminToken, deleteAUser)
adminRouter.get("/getAllPrice", verifyAdminToken, getAllPrice)
adminRouter.post("/acceptPrice/:id", verifySuperAdminToken, acceptPriceChange)
adminRouter.post("/rejectPrice/:id", verifySuperAdminToken, rejectPriceChange)

module.exports = adminRouter