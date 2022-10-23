import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'

const BranchSeqFactory = () => {
  return dbConfig.define(
    'Branches',
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      BranchName: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      timestamps: false,
      tableName: 'Branches'
    },
  )
}

const BranchSeq = BranchSeqFactory()


export default BranchSeq
