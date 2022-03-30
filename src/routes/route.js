const express = require("express");

const router = express.Router();

const userController = require("../controller/userController");
const bookController = require("../controller/bookController");
const reviewCrontroller = require("../controller/reviewController");
const middleware = require("../middleware/auth");

//user API's
router.post("/register", userController.createUser);   // CreateUser
router.post("/login", userController.login);   // LoginUser

//book API's
router.post("/books", middleware.userAuth, bookController.createBook);   // CreateBook
router.get("/books", middleware.userAuth, bookController.getBooksbyquery);   //GetBooks
router.get("/books/:bookId", middleware.userAuth, bookController.getBooksById);   //GetBooksbyID
router.put("/books/:bookId", middleware.userAuth, bookController.updateBooks);   //UpdateBooks
router.delete("/books/:bookId", middleware.userAuth, bookController.deleteBooks);

//Review API's
router.post("/books/:bookId/review", reviewCrontroller.createReview);   //CreateReview
router.put("/books/:bookId/review/:reviewId", reviewCrontroller.updateReview);   //UpdateReview
router.delete("/books/:bookId/review/:reviewId", reviewCrontroller.deleteReview);   //DeleteReview

module.exports = router;