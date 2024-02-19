const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, validateUser, generateAuthToken } = require("../models/user");
const saltRounds = 10;
const authMiddleware = require("../middleware/auth");
router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).send("User already registered");

    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      phoneNumber: req.body.phoneNumber,
      isAdmin: req.body.isAdmin ? true : false,
    });
    const savedUser = await user.save();
    const token = generateAuthToken(user);
    res.header("x-auth-token", token).send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error for user");
  }
});
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userid = req.user;
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).send("User not found");
    }
    const userResponse = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    };

    res.status(200).send(userResponse);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
