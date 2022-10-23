import { Sequelize } from 'sequelize';
import { AuditSeq ,BuildingSeq,UserClientSeq} from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'

async function findById(id) {
  const raw = 
  `SELECT a.Id,a.AuditCode,a.LocationClient_Id,a.Date,a.PresentClient ,uc.CompanyName,uc.ContactPerson,br.BranchName ,bd.Name as Location
  FROM Audits as a
  inner join  Users_Client as uc on a.NameClient_Id=uc.Id
  inner join Branches as br on br.Id=uc.Branch_Id
  inner join Buildings as bd on bd.Id=a.LocationClient_Id
  where a.Id='${id}'
  GROUP BY a.AuditCode,a.Date,a.PresentClient , uc.CompanyName,uc.ContactPerson,br.BranchName,bd.Name,a.LocationClient_Id,a.Id`
  
   return AuditSeq.sequelize.query(raw, {
     replacements:id,
     type: Sequelize.QueryTypes.SELECT
   })
 }

const findAll = async (req) => {
  const raw = 
  `SELECT  a.IsDone,a.Id,a.AuditCode,a.LocationClient_Id,a.Date,a.PresentClient ,uc.CompanyName as client,uc.ContactPerson,br.BranchName ,bd.Name as Location
  FROM [fdis].[dbo].[Audits] as a
  inner join  [fdis].[dbo].[Users_Client] as uc on a.NameClient_Id=uc.Id
  inner join [fdis].[dbo].[Branches] as br on br.Id=uc.Branch_Id
  inner join [fdis].[dbo].[Buildings] as bd on bd.Id=a.LocationClient_Id  ORDER BY  a.AuditCode ASC
  `
   return AuditSeq.sequelize.query(raw, {
     type: Sequelize.QueryTypes.SELECT
   })
}

export default {
  findById,
  findAll
}
