const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserSociety extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  UserSociety.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    UserSociety.init(
        {
            user_id: DataTypes.STRING,
            society_id: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'user_society',
            underscored: true,
        },
    );
    return UserSociety;
};
