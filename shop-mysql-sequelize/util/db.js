const Sequelize = require('sequelize');
const sequelize = new Sequelize('shopdb', 'root', 'theArtofwar!', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
