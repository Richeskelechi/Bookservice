const express = require('express');
const bookRouter = express.Router();
const { addANewBook, getAllBooks, getSingleBooks, getAllUsersBooks, changePriceRequest } = require("../Controllers/bookController")

const { verifyToken } = require("../Middlewares/verifyToken")

bookRouter.post("/", verifyToken, addANewBook)
bookRouter.get("/", getAllBooks)
bookRouter.get("/:id", getSingleBooks)
bookRouter.get("/getUserBook/:userId", verifyToken, getAllUsersBooks)
bookRouter.post("/changePrice", verifyToken, changePriceRequest)
// userRouter.put("/:id", verifyToken, updateUser)
// userRouter.delete("/:id", verifyToken, deleteUser)

module.exports = bookRouter