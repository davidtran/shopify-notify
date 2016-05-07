module.exports = function(sequelize, DataTypes) {
  var Visit = sequelize.define('Visit', {
    ip: DataTypes.STRING(50),
    url: DataTypes.STRING(255),
  }, {
    indexes: [{
      fields: ['ip']
    }, {
      fields: ['url']
    }],
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  })
  return Visit;
}