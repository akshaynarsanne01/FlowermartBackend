const express = require("express");
const multer = require("multer");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const { Product } = require("../models/product");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Define the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    // Define the filename for uploaded files
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
router.use("/uploads", express.static("uploads"));

//routes
router.post("/:id", upload.single("image"), async (req, res) => {
  try {
    const product_id = req.params.id;
    const productId = new mongoose.Types.ObjectId(product_id);

    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    if (req.file) {
      const updateProduct = await Product.findByIdAndUpdate(
        product_id,
        { $set: { image: req.file.filename } },
        { new: true }
      );

      if (!updateProduct) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to update product" });
      }

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        file: req.file,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      // Handle the CastError here
      console.error(`Invalid ObjectId: ${product_id}`);
      return res
        .status(400)
        .json({ success: false, message: "Invalid ObjectId" });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
});

module.exports = router;
