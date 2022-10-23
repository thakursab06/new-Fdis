import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'

const FloorSeqFactory = () => {
  return dbConfig.define(
    'Floors',
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      FloorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      FloorNameAbv: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      SortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      timestamps: false,
      tableName: 'Floors'
    },
  )
}

const FloorSeq = FloorSeqFactory()

export default FloorSeq
