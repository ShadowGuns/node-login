const authJwt = require("./auth.jwt");
const verifySignUp = require("./verify.sign.up");
const verifySignin = require("./verify.sign.in");
const validate = require("./validate.url");

module.exports = {
  authJwt,
  verifySignUp,
  verifySignin,
  validate
};