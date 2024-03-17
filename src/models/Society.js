const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Society extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  Society.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    Society.init(
        {
            uuid: DataTypes.UUID,
            society_name: DataTypes.STRING,
            country_code: DataTypes.STRING,
            url: DataTypes.STRING,
            image_url: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'society',
            underscored: true,
        },
    );
    return Society;
};
