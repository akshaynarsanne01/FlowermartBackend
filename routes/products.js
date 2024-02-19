const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { Product, validateProduct } = require("../models/product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    console.log("ok");
    res.json(products);
  } catch (error) {
    res.status(500).send("Internal Server error");
  }
});
router.get("/featured", async (req, res) => {
  try {
    const lastFourProducts = await Product.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(4); // Limit the result to the last four products

    res.json(lastFourProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) return res.status(400).send({ error: "Product not found" });
    
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send("validation error");

    const newProduct = new Product({
      name: req.body.name,
      color: req.body.color,
      quantity: req.body.quantity,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      author: req.body.author,
      description: req.body.description,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).send("Internal server Error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send("Validation error");
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).send("Product not found");
    }
    existingProduct.name = req.body.name;
    existingProduct.color = req.body.color;
    existingProduct.quantity = req.body.quantity;
    existingProduct.image = existingProduct.image;
    existingProduct.brand = req.body.brand;
    existingProduct.price = req.body.price;
    existingProduct.author = req.body.author;
    existingProduct.description = req.body.description;

    const updatedProduct = await existingProduct.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the existing product by ID and delete it
    const result = await Product.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).send("Product not found");
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
