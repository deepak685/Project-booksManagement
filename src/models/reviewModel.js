const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: ObjectId,
      refs: "book-detail",
      required: true,
    },
    reviewedBy: {
      type: String,
      required: true,
      default: "Guest",
      // value: "reviewer's name",
    },
    rating: {
      type: Number,
      min: [1, "rating should be greater than 1"],
      max: [5, "rating should be less than 5"],
      required: true,
    },
    review: { String },
    reviewedAt: { Date },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review-detail", reviewSchema);
