const {verifySignUp, verifySignin} = require("../middleware");
const controller = require("../controllers/auth.controllers.js");
const {verifyToken} = require("../middleware/auth.jwt.js");


module.exports = function(app){
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateEmail
        ],
        controller.signup
    );
    app.post("/api/auth/verify-email", [verifyToken] ,controller.verifyEmail);
    app.post("/api/auth/signin",
        [
            verifySignin.checkVerifiedEmail
        ], 
        controller.signin
    );
    app.get("/api/oauth/google", controller.oauthGoogle);
    app.put("/api/auth/changepassword", [verifyToken], controller.changepassword);
    app.post("/api/auth/forgot-password", controller.forgotPassword);
    app.post("/api/auth/reset-password", [verifyToken], controller.resetPassword)
    app.delete('/api/auth/delete-account', [verifyToken], controller.deleteAccount);
};

    