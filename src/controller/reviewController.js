const bookModel = require("../models/bookModel");
const moment = require("moment");
const reviewModel = require("../models/reviewModel");
const valid=require("../validators/validate")



const createReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const review = req.body;
    const { reviewedBy, rating } = review;
    const isValidBookId = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });
    if (!isValidBookId) {
      return res.status(404).send({ status: true, msg: "no book found." });
    }
    if (!valid.isValidDetails(review)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide review of the book" });
    }

    if (!valid.isValidValue(reviewedBy)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide who reviewed the book" });
    }

    if (!valid.isValidValue(rating)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide the rating" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "rating should be greater than 1 and less than 5",
        });
    }

    const release = moment();
    const finalData = {
      bookId: bookId,
      ...review,
      reviewedAt: release,
    };
    const savedData = await reviewModel.create(finalData);
    res
      .status(201)
      .send({
        status: true,
        msg: "book review saved successfully",
        data: savedData,
      });

    const reviewCount = await reviewModel.find({
      bookId: bookId,
      isDeleted: false,
    });
    await bookModel.findOneAndUpdate(
      { _id: bookId },
      { reviews: reviewCount.length }
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const IsValidBookId = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });
    if (!IsValidBookId) {
      return res
        .status(404)
        .send({ status: true, msg: "no book found to update review." });
    }
    const reviewId = req.params.reviewId;
    const IsValidReviewId = await reviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });
    if (!IsValidReviewId) {
      return res
        .status(400)
        .send({ status: false, msg: "no review exists to update." });
    }
    const bookIdFromReview = IsValidReviewId.bookId;
    const userIdFromReview = await bookModel.findById(bookIdFromReview);
    if (
      userIdFromReview.userId.toString() !== IsValidBookId.userId.toString()
    ) {
      // for similar userId from param & bookModel to update
      return res
        .status(403)
        .send({
          status: false,
          msg: "Unauthorized access. Review can't be updated",
        });
    }
    const dataToUpdate = req.body;
    if (!valid.isValidDetails(dataToUpdate)) {
      res
        .status(400)
        .send({
          status: false,
          msg: "Please provide the review details to update",
        }); //Validate the value that is provided by the Client.
    }
    const { review, rating, reviewedBy } = dataToUpdate;
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "rating should be greater than 1 and less than 5",
        });
    }
    const updatedDetails = await reviewModel.findOneAndUpdate(
      { _id: reviewId },
      { review: review, rating: rating, reviewedBy: reviewedBy },
      { new: true }
    );
    res
      .status(201)
      .send({
        status: true,
        msg: "review updated successfully",
        data: updatedDetails,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

const deleteReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const IsValidBookId = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });
    if (!IsValidBookId) {
      return res
        .status(404)
        .send({ status: true, msg: "no book found to delete review." });
    }
    const reviewId = req.params.reviewId;
    const IsValidReviewId = await reviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });
    if (!IsValidReviewId) {
      return res
        .status(404)
        .send({ status: true, msg: "no review exists to delete." });
    }
    const bookIdFromReview = IsValidReviewId.bookId;
    const userIdFromReview = await bookModel.findById(bookIdFromReview);
    if (
      userIdFromReview.userId.toString() !== IsValidBookId.userId.toString()
    ) {
      return res
        .status(403)
        .send({
          status: false,
          msg: "Unauthorized access. Review can't be deleted",
        });
    }
    const deletedData = await reviewModel.findOneAndUpdate(
      { _id: reviewId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    res
      .status(201)
      .send({
        status: true,
        msg: "review deleted successfully",
        data: deletedData,
      });

    const reviewCount = await reviewModel.find({
      bookId: bookId,
      isDeleted: false,
    });
    await bookModel.findOneAndUpdate(
      { _id: bookId },
      { reviews: reviewCount.length }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
