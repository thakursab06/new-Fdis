import { DataTypes } from 'sequelize'
import { dbConfig } from '../../init/db'
import { UserClientSeq } from '../../models'

const ElementSeqFactory = () => {
  return dbConfig.define(
    'Element',
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      ElementLabel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ElementStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      }
    },
    {
      timestamps: false,
      tableName: 'Element'
    },
  )
}


const ElementClientSeq = dbConfig.define('ElementClient', {
  ElementClientStatus: {
    type: DataTypes.BOOLEAN,
  }
}, {
  timestamps: false,
  tableName: 'ElementClient'
});

const ElementSeq = ElementSeqFactory()

setTimeout(() => {
  ElementSeq.belongsToMany(UserClientSeq, {
    through: ElementClientSeq,
    as: 'UserClient',
    foreignKey: 'IdElement',
    timestamps: false
  });

  UserClientSeq.belongsToMany(ElementSeq, {
    through: ElementClientSeq,
    as: 'Element',
    foreignKey: 'IdClient',
    timestamps: false
  });
}, 0)

export default ElementSeq
