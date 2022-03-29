const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
// const moment = require('moment');
const reviewModel = require("../models/reviewModel");

// validation
const isValidValue = function (value) {
  //it should not be like undefined or null.
  if (typeof value === "undefined" || value === null) return false; //if the value is undefined or null it will return false.
  if (typeof value === "string" && value.trim().length === 0) return false; //if the value is string & length is 0 it will return false.
  return true;
};

const isValidDetails = function (details) {
  return Object.keys(details).length > 0;
};

const createBook = async function (req, res) {
  try {
    const book = req.body;
    if (!isValidDetails(book)) {
      res
        .status(400)
        .send({ status: false, msg: "Please provide the Book details." }); //Validate the value that is provided by the Client.
    }
    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      book;
    if (!isValidValue(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the Title." }); //Title is mandory
    }
    const isDuplicateTitle = await bookModel.findOne({ title: title });
    if (isDuplicateTitle) {
      return res
        .status(400)
        .send({ status: true, msg: "Title already exists." }); //Title is unique
    }
    if (!isValidValue(excerpt)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the excerpt." }); //Excerpt is mandory
    }
    
    const isValidUserId = await userModel.findById(userId);
    if (!isValidUserId) {
      return res.status(404).send({ status: true, msg: "User not found." }); //find User
    }
    if (!isValidValue(ISBN)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the ISBN." }); //ISBN is mandory
    }
    const isDuplicateISBN = await bookModel.findOne({ ISBN: ISBN });
    if (isDuplicateISBN) {
      return res
        .status(400)
        .send({ status: true, msg: "ISBN already exists." }); //ISBN is unique
    }
    if (!isValidValue(category)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the Category." }); //Category is mandory
    }
    if (!isValidValue(subcategory)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the subCategory." }); //subcategory is mandory
    }
    if (!isValidValue(releasedAt)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Please provide the release date of book.",
        }); //subcategory is mandory
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(releasedAt)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: `${releasedAt} is an invalid date, formate should be YYYY-MM-DD`,
        });
    }
    const saved = await bookModel.create(book); //creating the Book details
    res
      .status(201)
      .send({ status: true, msg: "Book created successfully.", data: saved });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getBooksByQuery = async function (req, res) {
  try {
    const querry = req.query;
    const filter = {
      ...querry,
      isDeleted: false,
    }; //store the conditions in filter variable
    const findBooks = await bookModel
      .find(filter)
      .select({
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        releasedAt: 1,
        reviews: 1,
      })
      .sort({ title: 1 });
    if (findBooks.length == 0) {
      return res.status(404).send({ status: true, msg: "no book found." });
    }
    res.status(200).send({ status: true, msg: "Books list.", data: findBooks });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};


//02_____________________________________________________________________________________________
const getBooksById = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const bookDetails = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });
    if (!bookDetails) {
      return res.status(404).send({ status: true, msg: "no book found." });
    }
    const reviews = await reviewModel.find({ bookId: bookId });
    const finalBookDetails = {
      ...bookDetails._doc,
      reviewsData: reviews,
    };
    res
      .status(200)
      .send({ status: true, msg: "Books list.", data: finalBookDetails });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

//04___________________________________________________________________________________________________________
const updateBooks = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const IsValidBookId = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });
    if (!IsValidBookId) {
      return res
        .status(404)
        .send({ status: true, msg: "no book found to update." });
    }
  
    const dataToUpdate = req.body;
    if (!isValidDetails(dataToUpdate)) {
      res
        .status(400)
        .send({
          status: false,
          msg: "Please provide the book details to update",
        }); //Validate the value that is provided by the Client.
    }
    const { title, ISBN, excerpt } = dataToUpdate;
    const isDuplicateTitle = await bookModel.findOne({ title: title });
    if (isDuplicateTitle) {
      return res
        .status(400)
        .send({
          staus: false,
          msg: "book with provided title is already present.",
        });
    }
    const isDuplicateISBN = await bookModel.findOne({ ISBN: ISBN });
    if (isDuplicateISBN) {
      return res
        .status(400)
        .send({
          staus: false,
          msg: "book with provided ISBN no. is already present.",
        });
    }
    const updatedDetails = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { title: title, excerpt: excerpt, ISBN: ISBN },
      { new: true, upsert: true }
    );
    res
      .status(201)
      .send({
        status: true,
        msg: "book details updated successfully",
        data: updatedDetails,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

//05_________________________________________________________________________________________________
const deleteBooks = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const IsValidBookId = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });
    if (!IsValidBookId) {
      return res
        .status(404)
        .send({ status: true, msg: "no book found to delete." });
    }
  
    const deletedDetails = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    res
      .status(201)
      .send({
        status: true,
        msg: "book deleted successfully",
        data: deletedDetails,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

module.exports.createBook = createBook;
module.exports.getBooksByQuery = getBooksByQuery;
module.exports.getBooksById = getBooksById;
module.exports.deleteBooks = deleteBooks;
module.exports.updateBooks = updateBooks;
