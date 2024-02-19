const {
  User,
  validateUserlogin,
  generateAuthToken,
} = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

const tokenBlacklist = new Set();

router.post("/login", async (req, res) => {
  try {
    const { error } = validateUserlogin(req.body);
    if (error) return res.status(400).send({ error: error });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).send({ error: "User not found with this email" });

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid)
      return res.status(400).send({ error: "Invalid email or password" });
    const token = generateAuthToken(user);
    console.log(user);
    res.header("x-auth-token", token).send({
      success: true,
      message: "Login successful!",
      user: {
        _id: user._id,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  // Assuming the token is included in the request headers
  const token = req.headers["x-auth-token"];
  if (token) {
    res
      .header("x-auth-token", null)
      .status(200)
      .send({ success: true, message: "Logout successful!" });
  } else {
    res.status(400).send({ error: "No token provided" });
  }
});

module.exports = router;
