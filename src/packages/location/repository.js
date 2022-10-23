import { SuperPerformer,BuildingSeq} from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'
import { Sequelize } from 'sequelize';

async function findById(id) {
  return BuildingSeq.findByPk(id, {
    include: ['UserClient']
  })
}

async function findOne(query) {
  return BuildingSeq.findOne({
    where: {
      ...query
    },
    include: ['UserClient']
  });
}

async function create(body) {
  return BuildingSeq.create(body)
}

async function updateOne(query, body) {
  return BuildingSeq.update(body, { where: { ...query } })
}

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  return BuildingSeq.findAndCountAll({
    where: condition,
    ...option,
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    },
    include: ['UserClient']
  })
}

async function countDocuments(query) {
  return BuildingSeq.count(query)
}

const destroy = async (id) => {
  return BuildingSeq.destroy({ where: { Id: id } })
}

const rawQueryListFilter = async (id) => {
  console.log("Client Id", id)
  const raw = 
  ` SELECT * FROM [fdis].[dbo].[Buildings] where ClientId='${id}'`
   return BuildingSeq.sequelize.query(raw, {
    replacements:[id],
    type: Sequelize.QueryTypes.SELECT
   })
 }

 const filterPerformer = async (id) => {
  console.log("Client Id", id)
  const raw = 
  `SELECT *
  FROM  aspnet_Roles
  inner join aspnet_UsersInRoles on aspnet_Roles.RoleId=aspnet_UsersInRoles.RoleId
  inner join aspnet_Users on aspnet_UsersInRoles.UserId=aspnet_Users.UserId
  inner join aspnet_Membership on aspnet_Users.UserId=aspnet_Membership.UserId
  inner join Users on aspnet_Users.UserName=Users.UserName
  inner join Emails on Users.Id=Emails.UserId
  inner join Users_Auditor on Users.Id=Users_Auditor.Id
  inner join TypeOfPerformers on Users_Auditor.Id= TypeOfPerformers.Performers_Id
  inner join PerformerType on TypeOfPerformers.PerformerTypes_Id=PerformerType.Id
  inner join ClientAuditor on Users_Auditor.Id=ClientAuditor.AuditorId
  inner join Users_Client on ClientAuditor.ClientId=Users_Client.Id
  where aspnet_Roles.RoleId='3CAE92A2-6F11-4BC8-8F7D-F0E7057C63B7' and
   ClientId='${id}'`
   return SuperPerformer.sequelize.query(raw, {
    replacements:[id],
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
  rawQueryListFilter,
  filterPerformer
}
