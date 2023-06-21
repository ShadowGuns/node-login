const db = require("../models");
const User = db.user;

checkVerifiedEmail = async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      });
  
      if (!user) {
        return res.status(404).send({
          message: "User not found!"
        });
      }
        if (!user.verified) {
            return res.status(401).send({
                message: "User not verified!"
            });
        }
      next();
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

const verifySignin = {
    checkVerifiedEmail: checkVerifiedEmail,
};
  
module.exports = verifySignin;