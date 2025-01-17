const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.js'
});

module.exports = {
    sequelize,
    DataTypes,
}