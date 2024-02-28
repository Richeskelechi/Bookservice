const { validateNewBook, validateChangeBookPrice } = require("../Validate/bookValidate")
const Book = require("../Models/Books")
const ChangePrice = require("../Models/ChangePrice")
const addANewBook = async (req, res) => {
    try {
        const { error } = validateNewBook(req.body)
        if (error) {
            return res.status(400).json({ status: 400, ok: false, message: error.details[0].message });
        }
        if (req.body.quantity < 1) {
            return res.status(400).json({ status: 400, ok: false, message: "Book Quantity Should be greater than 0" });
        }
        if (req.body.price < 1) {
            return res.status(400).json({ status: 400, ok: false, message: "Book Price Should be greater than 0" });
        }
        const isBookExist = await Book.findOne({ bookName: req.body.bookName })
        if (isBookExist) {
            return res.status(400).json({ status: 400, ok: false, message: "Book Name already exists. Please Enter Another name" });
        }

        const newBook = new Book({
            email: req.user.email,
            userId: req.user._id,
            bookName: req.body.bookName,
            bookAuthor: req.body.bookAuthor,
            quantity: req.body.quantity,
            price: req.body.price,
        })
        await newBook.save()

        return res.status(201).json({ status: 201, ok: true, message: "Book Added successfully Awaiting Comfirmation From Admin" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const getAllBooks = async (req, res) => {
    try {
        const allBooks = await Book.find({ status: "Active" })
        return res.status(200).json({ status: 200, ok: true, message: allBooks })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const getSingleBooks = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A User Id" });
        }
        const book = await Book.findOne({ _id: id })
        if (!book) {
            return res.status(404).json({ status: 404, ok: false, message: "Book Not Found" });
        }
        return res.status(200).json({ status: 200, ok: true, message: book })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const getAllUsersBooks = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A User Id" });
        }
        if (userId != req.user.id) {
            return res.status(400).json({ status: 400, ok: false, message: "Please Provide A Valid User Id" });
        }
        const allBooks = await Book.find({ userId: userId })
        return res.status(200).json({ status: 200, ok: true, message: allBooks })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }
}

const changePriceRequest= async (req, res) => {
    try {
        const { error } = validateChangeBookPrice(req.body)
        if (error) {
            return res.status(400).json({ status: 400, ok: false, message: error.details[0].message });
        }
        if (req.body.price < 1) {
            return res.status(400).json({ status: 400, ok: false, message: "Book Price Should be greater than 0" });
        }
        const book = await Book.findOne({ _id: req.body.bookId })
        if (!book) {
            return res.status(400).json({ status: 400, ok: false, message: "Book With The Specified ID Does Not Exist" });
        }
        const newPrice = new ChangePrice({
            email: req.user.email,
            userId: req.user._id,
            bookId: book._id,
            price: req.body.price,
            description: req.body.description,
        })
        await newPrice.save()
        return res.status(201).json({ status: 201, ok: true, message: "Request For Change In Price Sent. Awaiting Comfirmation From Admin" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, ok: false, message: error.message });
    }

}


module.exports = { addANewBook, getAllBooks, getSingleBooks, getAllUsersBooks, changePriceRequest }