const {verifySignUp, verifySignin, authJwt, validate} = require("../middleware");
const controller = require("../controllers/auth.controllers.js");

module.exports = function(app){
    app.post("/api/auth/signup", verifySignUp.checkDuplicateEmail, controller.signup);
    app.post("/api/auth/verify-email", authJwt.verifyToken, controller.verifyEmail);
    app.post("/api/auth/signin", verifySignin.checkVerifiedEmail, controller.signin);
    app.get("/api/oauth/google", controller.oauthGoogle);
    app.put("/api/auth/changepassword", authJwt.verifyToken, controller.changepassword);
    app.post("/api/auth/forgot-password", controller.forgotPassword);
    app.post("/api/auth/reset-password", authJwt.verifyToken, controller.resetPassword);
    app.delete('/api/auth/delete-account', authJwt.verifyToken, controller.deleteAccount);
    app.post("/api/generate-url", validate.checkUrls, controller.generateUrl);
    app.get("/api/:code", controller.getUrl);
};

    