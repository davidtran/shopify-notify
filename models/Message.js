module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message' ,{
    content: DataTypes.STRING(500),
    initialDelay: DataTypes.INTEGER,
    displayTime: DataTypes.INTEGER,
    minViewCount: DataTypes.INTEGER,
    entranceAnimation: DataTypes.STRING,
    exitAnimation: DataTypes.STRING,
    position: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    mobile: DataTypes.BOOLEAN,
    customCss: DataTypes.TEXT,
    style: DataTypes.STRING
  }, {
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    classMethods: {
      associate: (models) => {
        Message.belongsTo(models.Shop, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return Message;
}