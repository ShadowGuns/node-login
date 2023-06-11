const config = require('../config/db.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    config.db, 
    config.user, 
    config.password, 
    {
        host: config.host,
        dialect: config.dialect,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.js")(sequelize, Sequelize);

module.exports = db;