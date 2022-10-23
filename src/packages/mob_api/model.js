import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'

const FormErrorElementSeqFactory = () => {
  return dbConfig.define(
    'FormErrorElement',
    {
      ErrorElementId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      FormId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ErrorTypeId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ElementId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Logbook: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      TechnicalAspects: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      LogbookImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      TechnicalAspectsImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    },
    {
      timestamps: false,
      tableName: 'FormErrorElement'
    },
  )
}

const FormErrorElement = FormErrorElementSeqFactory()

export default FormErrorElement
