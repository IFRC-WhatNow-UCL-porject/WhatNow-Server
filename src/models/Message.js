const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  Message.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    Message.init(
        {
            uuid: DataTypes.UUID,
            society_id: DataTypes.STRING,
            region_id: DataTypes.STRING,
            language_code: DataTypes.STRING,
            content_type: DataTypes.STRING,
            type: DataTypes.STRING,
            content: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'message',
            underscored: true,
        },
    );
    return Message;
};
