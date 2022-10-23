import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'


const UserSeqFactory = () => {
  return dbConfig.define(
    'Users',
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      UserName: { type: DataTypes.STRING, allowNull: false },
      FirstName: { type: DataTypes.INTEGER, allowNull: true },
      LastName: { type: DataTypes.STRING, allowNull: true },
      ProfileImage: { type: DataTypes.UUID, allowNull: true },
    },
    {
      timestamps: false,
      tableName: 'Users'
    },
  )
}

const UserSeq = UserSeqFactory()


export default UserSeq
