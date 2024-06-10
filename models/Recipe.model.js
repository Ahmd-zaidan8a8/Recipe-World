const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minlength: 20,
    required: true,
  },
  ingridients: {
    type: Array,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "the Meal shoulld have at least one ingredient.",
    },
    required: true,
  },
  instructions: {
    type: Array,
    validate: {
      validator: function (v) {
        return v.length > 2;
      },
      message: "the Meal should have at least three instructions.",
    },
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
