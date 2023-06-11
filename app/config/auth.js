const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });
const secret = process.env.SECRET;

module.exports = {
    secret
};