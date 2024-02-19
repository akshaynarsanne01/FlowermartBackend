const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

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
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  phoneNumber: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
  },
  password: {
    type: String,
    required: true,
    minlength: 5, // Adjusted from 10 to 5
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  userState: {
    type: Boolean,
    default: true,
  },
});
function generateAuthToken(user) {
  const token = jwt.sign({ _id: user._id }, jwtSecret);
  return token;
}
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const userSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(1024), // Adjusted from 10 to 5
    phoneNumber: Joi.number()
      .integer()
      .min(1000000000)
      .max(9999999999)
      .required(),
    isAdmin: Joi.boolean().optional(),
  });
  return userSchema.validate(user);
}
function validateUserlogin(user) {
  const emailSchema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return emailSchema.validate(user);
}

module.exports = { User, validateUser, generateAuthToken, validateUserlogin };
