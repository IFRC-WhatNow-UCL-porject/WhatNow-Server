const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Api extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  Audit.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    Api.init(
        {
            uuid: DataTypes.UUID,
            user_id: DataTypes.STRING,
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            hits: DataTypes.INTEGER,
            reach: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'api',
            underscored: true,
        },
    );
    return Api;
};
