const authJwt = require("./auth.jwt");
const verifySignUp = require("./verify.sign.up");
const verifySignin = require("./verify.sign.in");

module.exports = {
  authJwt,
  verifySignUp,
  verifySignin
};