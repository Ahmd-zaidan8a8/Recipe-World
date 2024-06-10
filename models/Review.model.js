const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    max: [5, 'Cannot rate more than 5 stars'],
    min: [0, 'Cannot rate less than 0 stars'],
    required: true,
  },
  // description: {
  //   type: String,
  //   minlength: 20,
  //   required: false,
  // },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
