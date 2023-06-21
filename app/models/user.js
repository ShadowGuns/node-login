module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.STRING,  // Set the data type as STRING
            primaryKey: true,       // Set id as the primary key
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,       // Ensure id is not nullable
          },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,       // Ensure email is not nullable
            unique: true            // Ensure email is unique
        },
        password:{
            type: Sequelize.STRING,
            allowNull: false
        },
        verified:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        email_verify_token:{
            type: Sequelize.STRING,
            defaultValue: ''
        },
        forgot_password_token:{
            type: Sequelize.STRING,
            defaultValue: ''
        }
    });
    return User;
};