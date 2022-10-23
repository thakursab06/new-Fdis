import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'

const ErrorCategorySeqFactory = () => {
  return dbConfig.define(
    'ErrorCategories',
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
      tableName: 'ErrorCategories'
    },
  )
}

const ErrorCategorySeq = ErrorCategorySeqFactory()

export default ErrorCategorySeq
