const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const Recipe = require("../models/Recipe.model");
const Review = require("../models/Review.model");
const upload = require("../middleware/upload");
require("express-async-errors");


const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
// GET
router.get("/", async (req, res) => {
  console.log("Retrieve all recipes.");
  const recipes = await Recipe.find();

  recipes.forEach((recipe) => {
    if (recipe.image) {
      recipe.image = BASE_URL + recipe.image;
    }
  });
  res.json({ count: recipes.length, results: recipes });
});

router.get("/:id", auth, async (req, res) => {
  console.log("Retrieve a specific recipe.");
  const recipe = await Recipe.findById(req.params.id).populate('reviews');

  if (!recipe) return res.status(404).send("the recipe is not found..!");

  recipe.image = BASE_URL + recipe.image;

  res.json(recipe);
});

// POST
router.post("/", auth, async (req, res) => {

  const { error } = validateRecipe(req.body);

  if (error) return res.status(400).json({ message: error.message });
  // image shape is object
  const recipeDetails = _.pick(req.body, [
    "title",
    "description",
    "ingridients",
    "instructions",
    "image",
    "category",
  ]);

  recipeDetails.author = req.user._id;
  recipeDetails.image = "/images/" + recipeDetails.image;

  const result = await Recipe.create(recipeDetails);
  console.log("New Recipe has been added to the dataBase .");
  res.json(result);
});

// Endpoint to save rating
router.put('/:id/rating', auth, async (req, res) => {
  
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) return res.status(404).send("the recipe is not found.!");

  console.log(req.user);

  const review = await Review.create({
    rating: req.body.rating,
    author: req.user._id
  });

  recipe.reviews.push(review);
  recipe.save();

  console.log("A review has been created");

  res.json(review);
});

// PUT
router.put("/:id", auth, async (req, res) => {

  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) return res.status(404).send("the recipe is not found.!");

 const newRecipe = { 
    title: req.body.title,
    description: req.body.description,
    ingridients: req.body.ingridients,
    instructions: req.body.instructions,
    category: req.body.category
  }

  const { error } = validateRecipeEdit(newRecipe);

  if (error) return res.status(400).send(error.message);

  recipe.title = req.body.title;
  recipe.description = req.body.description;
  recipe.ingridients = req.body.ingridients;
  recipe.instructions = req.body.instructions;
  recipe.category = req.body.category;
  recipe.image = req.body.image;

  recipe.save();

  console.log("a Recipe has been updated in the dataBase .");
  res.json(recipe);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) return res.status(404).send("the recipe with is not found.!");

  const deletedRecipe = await Recipe.deleteOne({ _id: id });

  console.log("a recipe has been deleted from the dataBase.");
  res.send("you have sucsessfully removed a recipe.");
});

// Upload images:
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    console.log(req.file)
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      if (!req.file) {
        return res.status(400).json({ error: 'No file selected' });
      }
      
      res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    }
  });
});


function validateRecipeEdit(recipe) {
  const ENUM = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const schema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(255).required(),
    ingridients: Joi.array().items(Joi.string().required()).min(1).required(),
    instructions: Joi.array().items(Joi.string().required()).min(3).required(),
    category: Joi.string()
      .valid(...ENUM)
      .required(),
  });

  return schema.validate(recipe);
}

function validateRecipe(recipe) {
  const ENUM = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const schema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(255).required(),
    ingridients: Joi.array().items(Joi.string().required()).min(1).required(),
    instructions: Joi.array().items(Joi.string().required()).min(3).required(),
    image: Joi.string().min(5).max(500).required(),
    category: Joi.string()
      .valid(...ENUM)
      .required(),
  });

  return schema.validate(recipe);
}

module.exports = router;
