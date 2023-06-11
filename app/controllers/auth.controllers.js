const db = require("../models");
const config = require("../config/auth");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    .then(user => {
        res.send({ message: "User was registered successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });

        res.status(200).send({
            accessToken: token,
            message: "User authenicated succesfully!"
        });
      })
      .catch(err=>{
        res.status(500).send({ message: err.message });
      });
};

exports.changepassword = (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.userId;

  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found'
        });
      }

      const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({
          message: 'Invalid Password!'
        });
      }

      // Update the user's password
      const hashedPassword = bcrypt.hashSync(newPassword, 8);
      user.password = hashedPassword;
      user.save();

      res.send({ message: 'Password was changed successfully!' });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteAccount = async (req, res) => {
  const { password } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    // Xóa tài khoản người dùng
    await user.destroy();

    res.send({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while deleting the account' });
  }
};
