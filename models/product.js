const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 40,
  },
  color: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  image: {
    type: String,
  },
  brand: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
  },
  author: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
//   return token;
// };

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(40).required(),
    color: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    image: Joi.string(),
    brand: Joi.string(),
    price: Joi.number().min(0).max(10000).required(),
    author: Joi.string().min(5).max(255),
    description: Joi.string().min(5).max(255),
  });

  return schema.validate(product);
}

module.exports = {
  validateProduct,
  Product,
};
