const jwt = require('jsonwebtoken');
const config = require('../config/auth.js');
const db = require("../models");
const User = db.user;

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    const userId = decoded.id;

    // Perform a database check to verify the token
    const user = await User.findOne({
      where: {
        id: userId,
        forgot_password_token: token
      }
    });

    if (!user) {
      return res.status(401).send({
        message: "Invalid token or user not found!"
      });
    }

    req.userId = userId;
    next();
  } catch (err) {
    return res.status(401).send({
      message: "Unauthorized!"
    });
  }
};

const authJwt = {
    verifyToken: verifyToken
};
module.exports = authJwt;