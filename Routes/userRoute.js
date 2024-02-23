const express = require('express');
const userRouter = express.Router();
const { addANewUser, loginUser, getUser, updateUser, deleteUser } = require("../Controllers/userController")

const { verifyToken } = require("../Middlewares/verifyToken")

userRouter.post("/", addANewUser)
userRouter.post("/login", loginUser)
userRouter.get("/:id", verifyToken, getUser)
userRouter.put("/:id", verifyToken, updateUser)
userRouter.delete("/:id", verifyToken, deleteUser)

module.exports = userRouter