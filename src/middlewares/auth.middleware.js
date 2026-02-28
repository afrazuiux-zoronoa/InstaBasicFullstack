const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

async function isAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  const InvalidToken = await blacklistModel.findOne({ token });

  if (InvalidToken) {
    return res.status(400).json({
      message: "Token is not valid anymore, login again",
    });
  }
  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

  req.user = verifiedToken;

  next();
}

module.exports = isAuthenticated;
