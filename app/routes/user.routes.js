const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controllers.js");

module.exports = function(app) {
  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );
};