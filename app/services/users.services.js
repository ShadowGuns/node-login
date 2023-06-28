const axios = require('axios');
const config = require('../config/auth');
const db = require("../models");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

class UsersService {
    async getOauthGoogleToken(code) {
        const body = {
            code,
            client_id: config.GOOGLE_CLIENT_ID,
            client_secret: config.GOOGLE_CLIENT_SECRET,
            redirect_uri: config.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code'
        };
        const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return data;
    }
    async getGoogleUserInfo(access_token, id_token) {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            params: {
                access_token,
                alt: 'json'
            },
            headers: {
                Authorization: `Bearer ${id_token}`
            }
        });
        return data;
    }
    async oauth(code) {
        const { id_token, access_token } = await this.getOauthGoogleToken(code);
        const userInfo = await this.getGoogleUserInfo(access_token, id_token);
        if (!userInfo.verified_email) {
            throw new Error({
                message: 'Email not verified',
                status: 400
            });
        }
        //Check email registered before
        const user = await User.findOne({ where: { email: userInfo.email }});
        // If exist -> login, else -> register
        if (user) {
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: '90d' // 24 hours
              });
            return {
                access_token: token
            };
        }
        else {
            const newUser = await User.create({
                name: userInfo.name, // Set the user's name
                email: userInfo.email,
                password: bcrypt.hashSync(Math.random().toString(), 8), // Generate a random password
              });
            
              var token = jwt.sign({ id: newUser.id }, config.secret, {
                expiresIn: '90d' // 90 days
              });
            
              return {
                access_token: token,
                message: 'User created successfully'
              };
        }
    }
}
module.exports = new UsersService();