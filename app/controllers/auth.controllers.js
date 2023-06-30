const db = require("../models");
const config = require("../config/auth");
const User = db.user;
const Urls = db.urls;
const usersService = require('../services/users.services');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    })
    .then(user => {
      var email_verify_token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: '90d' 
      });
      user.email_verify_token = email_verify_token;
      user.save();
        res.send({ 
          message: "User was registered successfully!", 
          email_verify_token: email_verify_token 
      });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.verifyEmail = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    await user.update({ verified: true });
    await user.update({ email_verify_token: null });
    res.send({ message: 'Verify account success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.signin = (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
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
            message: "Invalid Password!"
          });
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: '90d' // 24 hours
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

exports.oauthGoogle = async (req, res) => {
  const { code } = req.query
  const result = await usersService.oauth(code)
  const urlRedirect = `${config.CLIENT_REDIRECT_CALLBACK}?access_token=${result.access_token}`
  return res.redirect(urlRedirect)
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

exports.forgotPassword = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: '90d' 
        });
      user.forgot_password_token = token;
      await user.save();

      res.status(200).send({
          forgot_password_token: token,
          message: "Check email to reset password!"
      });
    })
    .catch(err=>{
      res.status(500).send({ message: err.message });
    });
};

exports.resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const userId = req.userId;

  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found'
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(401).send({
          message: 'Confirm password is not match!'
        });
      }

      // Update the user's password
      const hashedPassword = bcrypt.hashSync(newPassword, 8);
      user.password = hashedPassword;
      user.forgot_password_token = null;
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

function generateRandomCode() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  const length = 4;
  let code = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
  }

  return code;
}

exports.generateUrl = async (req, res) => {
  const {url} = req.body;
  try{
    let code = generateRandomCode();
    let existingCode = await Urls.findOne({ where: { code: code } });
    while (existingCode) {
      code = generateRandomCode();
      existingCode = await Urls.findOne({ where: { code: code } });
    }
    await Urls.create({
      code: code,
      url: url
    });
    res.json({ code: code });
  } catch(error){
    res.status(500).json({ error: error.message });
  }
}

exports.getUrl = async (req, res) => {
  const code = req.params.code;
  try{
    const url = await Urls.findOne({ where: { code: code } });
    if(!url){
      return res.status(404).json({ error: 'Url not found' });
    }
    res.json({ url: url.url });
  } catch(error){
    res.status(500).json({ error: error.message });
  }
}
