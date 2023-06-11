const {verifySignUp} = require("../middleware");
const controller = require("../controllers/auth.controllers.js");
const {verifyToken} = require("../middleware/auth.jwt.js");

module.exports = function(app){
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail
        ],
        controller.signup
    );
    app.post("/api/auth/signin", controller.signin);
    app.post("/api/auth/changepassword", [verifyToken], controller.changepassword);
    app.post('/api/auth/delete-account', [verifyToken], controller.deleteAccount);
};

    