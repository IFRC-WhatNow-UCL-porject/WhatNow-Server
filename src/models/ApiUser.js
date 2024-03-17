const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ApiUser extends Model {
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

    ApiUser.init(
        {
            uuid: DataTypes.UUID,
            location: DataTypes.STRING,
            organization: DataTypes.STRING,
            industry_type: DataTypes.STRING,
            usage: DataTypes.TEXT
        },
        {
            sequelize,
            modelName: 'api_user',
            underscored: true,
        },
    );
    return ApiUser;
};
