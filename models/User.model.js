const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id , isAdmin: this.isAdmin }, process.env.JWT_PRIVATE_KEY);
};

userSchema.methods.validateAuthToken = function (authToken) {
  return jwt.verify(authToken, process.env.JWT_PRIVATE_KEY);
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexity(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
