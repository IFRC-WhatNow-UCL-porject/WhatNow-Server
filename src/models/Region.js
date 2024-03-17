const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Region extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  Region.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    Region.init(
        {
            uuid: DataTypes.UUID,
            region_name: DataTypes.STRING,
            society_id: DataTypes.STRING,
            description: DataTypes.TEXT,
            language_code: DataTypes.STRING,
            is_published: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'region',
            underscored: true,
        },
    );
    return Region;
};
