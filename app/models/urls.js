module.exports = (sequelize, Sequelize) => {
    const Url = sequelize.define("urls", {
        code: {
            type: Sequelize.STRING, 
            allowNull: false, 
            unique: true 
        },
        url: {
            type: Sequelize.STRING, 
            allowNull: false 
        }
    });
    return Url;
};