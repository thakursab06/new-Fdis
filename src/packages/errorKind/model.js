import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'

const ErrorKindSeqFactory = () => {
  return dbConfig.define(
    'ErrorKinds',
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'ErrorKinds'
    },
  )
}

const ErrorKindSeq = ErrorKindSeqFactory()

export default ErrorKindSeq
