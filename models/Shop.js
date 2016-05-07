module.exports = function(sequelize, DataTypes) {
  var Shop = sequelize.define('Shop', {
    shop: DataTypes.STRING,
    nonce: DataTypes.STRING,
    token: DataTypes.STRING,
    isInstalled: DataTypes.BOOLEAN,
    domain: DataTypes.STRING
  }, {
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  });
  return Shop;
}