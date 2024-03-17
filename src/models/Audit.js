const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Audit extends Model {
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

    Audit.init(
        {
            uuid: DataTypes.UUID,
            society_id: DataTypes.STRING,
            language_code: DataTypes.STRING,
            user_id: DataTypes.STRING,

            content_type: DataTypes.STRING,
            action: DataTypes.STRING,
            time: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'audit',
            underscored: true,
        },
    );
    return Audit;
};
