const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  UserRole.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    UserRole.init(
        {
            user_id: DataTypes.STRING,
            role_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'user_role',
            underscored: true,
        },
    );
    return UserRole;
};
