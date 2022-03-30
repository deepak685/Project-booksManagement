const express = require("express");

const router = express.Router();

const userController = require("../controller/userController");
const bookController = require("../controller/bookController");
const reviewCrontroller = require("../controller/reviewController");
const middleware = require("../middleware/auth");

//*******************************************user API's***********************************************************
// CreateUser
router.post("/register", userController.createUser);

// LoginUser
router.post("/login", userController.login);

//*******************************************book API's*********************************************************
// CreateBook
router.post("/books", middleware.userAuth, bookController.createBook);

//GetBooks
router.get("/books", middleware.userAuth, bookController.getBooksbyquery);

//GetBooksbyID
router.get("/books/:bookId", middleware.userAuth, bookController.getBooksById);

//UpdateBooks
router.put("/books/:bookId", middleware.userAuth, bookController.updateBooks);

//deleteBooks
router.delete(
  "/books/:bookId",
  middleware.userAuth,
  bookController.deleteBooks
);

//************************************************Review API's***************************************************
//CreateReview
router.post("/books/:bookId/review", reviewCrontroller.createReview);

//UpdateReview
router.put("/books/:bookId/review/:reviewId", reviewCrontroller.updateReview);

//DeleteReview
router.delete(
  "/books/:bookId/review/:reviewId",
  reviewCrontroller.deleteReview
);

module.exports = router;
