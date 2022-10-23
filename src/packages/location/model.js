import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import { UserClientSeq } from '../../models'

const BuildingSeqFactory = () => {
  return dbConfig.define(
    'Buildings',
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      Name: { type: DataTypes.STRING, allowNull: false },
      Size: { type: DataTypes.INTEGER, allowNull: false },
      ClientId: { type: DataTypes.STRING, allowNull: false },
      Region: { type: DataTypes.STRING, allowNull: true },
      City: { type: DataTypes.STRING, allowNull: true },
      Address: { type: DataTypes.STRING, allowNull: true },
      ContactPerson: { type: DataTypes.STRING, allowNull: true },
      Activate: { type: DataTypes.BOOLEAN, allowNull: true },
      Email: { type: DataTypes.STRING, allowNull: true },
    },
    {
      timestamps: false,
      tableName: 'Buildings'
    },
  )
}

const BuildingSeq = BuildingSeqFactory()


setTimeout(() => {
  BuildingSeq.belongsTo(UserClientSeq, {
    as: 'UserClient',
    foreignKey: 'ClientId',
    timestamps: false
  });
}, 0)

export default BuildingSeq
