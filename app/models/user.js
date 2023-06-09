module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.STRING,  // Set the data type as STRING
            primaryKey: true,       // Set id as the primary key
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,       // Ensure id is not nullable
          },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password:{
            type: Sequelize.STRING
        }
    });
    return User;
};