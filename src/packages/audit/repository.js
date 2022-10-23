
import { AuditSeq, UserClientSeq, BuildingSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'
import { Sequelize } from 'sequelize';


async function findById(id) {
  return AuditSeq.findByPk(id, {
    include: [
      {
      model: UserClientSeq,
      as: 'UserClient',
      include: ['Country', 'Branch']
      }, {
      model: BuildingSeq,
      as: 'Location',
    
    }]
  })
 }

async function findOne(query) {
  return AuditSeq.findOne({
    where: {
      ...query
    }
  });
}

async function create(body) {
  const  AuditCode =  Math.floor(100000 + Math.random() * 900000);
  const data = await findOne({
    AuditCode: AuditCode,
  })
  if (data) {
    throw new Error(JSON.stringify(commonLocale.dataAlreadyExisted))
  }
  const raw =  `INSERT INTO [dbo].[Audits]([AuditCode],[Date],[IsActive] ,[IsDone] ,[Type] ,[NameClient_Id] ,[LocationClient_Id],[PresentClient] ,[LastControlDate],[Activate])
  VALUES
  (${AuditCode}
  ,'${body.Date}'
  ,${body.IsActive}
  ,${body.IsDone}
  ,'${body.Type}'
  ,'${body.NameClient_Id}'
  ,'${body.LocationClient_Id}'
  ,'${body.PresentClient}'
  ,'${body.LastControlDate}'
  ,${body.Activate}
  )`
   return AuditSeq.sequelize.query(raw, {
    replacements:[''],
    type: Sequelize.QueryTypes.INSERT
   })
}

async function updateOne(query, body) {
  return AuditSeq.update(body, { where: { ...query } })
}

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  return AuditSeq.findAndCountAll({
    where: condition,
    ...option,
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    },
    include: [
      {
      model: UserClientSeq,
      as: 'UserClient',
      include: ['Country', 'Branch']
      }, {
      model: BuildingSeq,
      as: 'Location',
      where: request.locationId ? {
        Id: request.locationId
      } : {}
    }]
  })
}


async function countDocuments(query) {
  return AuditSeq.count(query)
}

const destroy = async (id) => {
  console.log(id);
  const row=`DELETE  FROM Users_Client WHERE Id=${id}`;
  console.log(row)
  return row
}

const findAllLocations =async(body)=>{
  console.log(body)
  const  id=body.id;
  const raw = 
  `SELECT  [Id]
      ,[Name]
      ,[Size]
      ,[ClientId]
      ,[Region]
      ,[City]
      ,[Address]
      ,[ContactPerson]
      ,[Activate]
      ,[Email] FROM [fdis].[dbo].[Buildings] WHERE ClientId=${id}`
  
   return BuildingSeq.sequelize.query(raw, {
     replacements:id,
     type: Sequelize.QueryTypes.SELECT
   })
}


export default {
  findById,
  findAll,
  create,
  findOne,
  updateOne,
  countDocuments,
  destroy,
  findAllLocations
}
