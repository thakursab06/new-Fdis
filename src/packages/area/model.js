import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import { CategorySeq } from '../../models'

const AreaSeqFactory = () => {
  return dbConfig.define(
    'Areas',
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      OrNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      IsActive: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      QrCode: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      CustomerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      timestamps: false,
      tableName: 'Areas'
    },
  )
}

const AreaSeq = AreaSeqFactory()

export default AreaSeq
