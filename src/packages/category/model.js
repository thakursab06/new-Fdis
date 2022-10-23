import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import { UserClientSeq } from '../../models'

const CategorySeqFactory = () => {
  return dbConfig.define(
    'Categories',
    {
      ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      CategoryNameAbv: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      IsFixed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      CategoryName: {
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
      tableName: 'Categories'
    },
  )
}

const CategorySeq = CategorySeqFactory()


setTimeout(() => {
  UserClientSeq.belongsToMany(CategorySeq, {
    through: 'Client_Category',
    as: 'Category',
    foreignKey: 'ClientId',
    timestamps: false
  });

  CategorySeq.belongsToMany(UserClientSeq, {
    through: 'Client_Category',
    as: 'UserClient',
    foreignKey: 'CategoryId',
    timestamps: false
  });
}, 0)
export default CategorySeq
