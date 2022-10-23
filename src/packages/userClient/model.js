import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import { CountrySeq, AuditSeq, BranchSeq, UserSeq } from '../../models'

const UserClientSeqFactory = () => {
  return dbConfig.define(
    'Users_Client',
    {
      Id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      CompanyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ContactPerson: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Mobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Fax: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      StreetName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ZipCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      City: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      State: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      CountryId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Branch_Id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      URLClientPortal: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ReportType: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      timestamps: false,
      tableName: 'Users_Client'
    },
  )
}

const UserClientSeq = UserClientSeqFactory()

setTimeout(() => {
  UserClientSeq.belongsTo(CountrySeq, {
    as: 'Country',
    foreignKey: 'CountryId'
  })
  UserClientSeq.belongsTo(BranchSeq, {
    as: 'Branch',
    foreignKey: 'Branch_Id'
  })
  UserClientSeq.hasMany(AuditSeq, {
    as: 'Audits',
    foreignKey: 'NameClient_Id'
  })

  UserClientSeq.belongsTo(UserSeq, {
    as: 'User',
    foreignKey: 'Id',
    timestamps: false
  })
}, 0)

export default UserClientSeq
