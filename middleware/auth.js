const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  // Check if the token is in the blacklist
  if (!token) {
    return res
      .status(401)
      .send("Access denied, No token provided or token blacklisted");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
