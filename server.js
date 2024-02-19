const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Products = require("./routes/products");
const users = require("./routes/users");
const auth = require("./routes/auth");
const cors = require("cors");
const fileupload = require("./routes/fileupload");

const app = express();
app.use(cors());
require("dotenv").config();

mongoose
  .connect("mongodb://127.0.0.1:27017/flowermart")
  .then(() => console.log("Connected to MongoDB.."))
  .catch((error) => console.error("Could not connect to MongoDB." + error));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world !");
});
app.use("/products", Products);
app.use("/users", users);
app.use("/auth", auth);
app.use("/upload", fileupload);
app.use("/uploads", express.static("uploads"));
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
