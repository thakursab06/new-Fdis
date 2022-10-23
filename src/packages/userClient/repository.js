import { Sequelize } from 'sequelize';
import { UserClientSeq, AuditSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'

async function findById(id) {
  return UserClientSeq.findByPk(id, {
    include: ['Country', 'Branch', 'User'],
  })
}

async function findOne(query) {
  return UserClientSeq.findOne({
    where: {
      ...query
    }
  });
}

async function create(body) {
  return (await UserClientSeq.create(body)).get({ plain: true })
}

async function updateOne(query, body) {
  return UserClientSeq.update(body, { where: { ...query } })
}

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  return UserClientSeq.findAndCountAll({
    where: condition,
    ...option,
    include: ['Country', 'Branch', 'User'],
    order: [['CompanyName', 'ASC']]
  })
}

/**
 * Audits Screen List
 * @param {*} request
 * @returns
 */
const findAllJoin = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  // return UserClientSeq.sequelize.query('SELECT uc.CompanyName,uc.ContactPerson,br.BranchName ,count(IsDone) as Audits FROM Audits as a inner join  Users_Client as uc on a.NameClient_Id=uc.Id inner join Branches as br on br.Id=uc.Branch_Id GROUP BY uc.CompanyName,uc.ContactPerson,br.BranchName', { type: Sequelize.QueryTypes.SELECT })

  return UserClientSeq.findAndCountAll({
    where: condition,
    ...option,
    attributes: [
      'Id', 'CompanyName', 'ContactPerson', 'Phone', 'Mobile', 'ReportType', 'URLClientPortal',

      [
        Sequelize.literal('(SELECT COUNT(*) FROM Audits WHERE Audits.NameClient_Id = Users_Client.Id)'),
        'AuditCount'
      ],
    ],
    include: ['Country', 'Branch'],
    order: [['CompanyName', 'ASC']]
  })
}

async function countDocuments(query) {
  return UserClientSeq.count(query)
}

const destroy = async (id) => {
  return UserClientSeq.destroy({ where: { Id: id } })
}

const rawQueryList = async () => {
  // const option = listRawInitOptions(request)
  const raw = `SELECT uc.Id,ur.UserName,uc.CompanyName,uc.ContactPerson,br.BranchName ,a.IsActive
  FROM Audits as a
  inner join  Users_Client as uc on a.NameClient_Id=uc.Id
  inner join Branches as br on br.Id=uc.Branch_Id
  inner join Users as ur on ur.Id=a.NameClient_Id
  WHERE a.IsActive IN (1)
  GROUP BY uc.CompanyName,uc.ContactPerson,br.BranchName,a.IsActive,ur.UserName,uc.Id
  ORDER BY uc.CompanyName`

  return AuditSeq.sequelize.query(raw, {
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
  findAllJoin,
  rawQueryList
}
