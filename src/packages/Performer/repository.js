import { Sequelize } from 'sequelize';
import { UserSeq,SuperPerformer} from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'
import method from './method'
//import uploadImages from '../../utils/multer'

async function findById(id) {

  return SuperPerformer.findByPk(id)

}

async function findOne(query) {
  return UserSeq.findOne({
    where: {
      ...query
    }
  });
}

//   // return (await SuperPerformer.cr
const create01 = async (qwery,body) => {
  let ApplicationId='04B61B6C-DB3B-49DB-B854-42F3654AD0D2';
  let AdminId='3CAE92A2-6F11-4BC8-8F7D-F0E7057C63B7';
  body.Password = await method.hashPassword(body.Password)
  const raw =  `BEGIN TRAN T1;
  INSERT INTO Users (UserName,FirstName,LastName)
  VALUES('${body.UserName}','${body.FirstName}','${body.LastName}') ;
  INSERT INTO aspnet_Users (ApplicationId,UserId,UserName,LoweredUserName,MobileAlias,IsAnonymous,LastActivityDate)
  VALUES('${ApplicationId}',(SELECT Id From Users Where UserName='${body.UserName}'),
  '${body.UserName}','${body.UserName}','${body.Mobile}',
  '${body.IsAnonymous}','${body.CreateDate}');
  INSERT INTO aspnet_UsersInRoles(RoleId,UserId)
  VALUES('${AdminId}',(SELECT Id From Users Where UserName='${body.UserName}'));
  INSERT INTO aspnet_Membership(ApplicationId,UserId,Password,PasswordFormat,PasswordSalt,MobilePIN,Email,IsApproved,IsLockedOut,CreateDate,LastLoginDate,LastPasswordChangedDate,LastLockoutDate
  ,FailedPasswordAttemptCount,FailedPasswordAttemptWindowStart,FailedPasswordAnswerAttemptCount,FailedPasswordAnswerAttemptWindowStart)
  VALUES('${ApplicationId}',
  (SELECT Id From Users Where UserName='${body.UserName}'),
  '${body.Password}',
  '${body.PasswordFormat}',
  '${body.PasswordSalt}',
  '${body.Mobile}','${body.Email}', '${body.IsApproved}','${body.IsLockedOut}','${body.CreateDate}', '${body.CreateDate}','${body.CreateDate}','${body.CreateDate}','${body.Count}','${body.CreateDate}','${body.Count}','${body.CreateDate}');
  INSERT INTO Users_Client(CompanyName,Id,ReportType)
  VALUES  ('${body.CompanyName}',(SELECT Id From Users Where UserName='${body.UserName}'),'${body.ReportType}');
  INSERT INTO Users_Auditor(Id,Mobile,Phone)
  VALUES ((SELECT Id From Users Where UserName='${body.UserName}'),'${body.Mobile}','${body.Phone}');
  INSERT INTO ClientAuditor(AuditorId,ClientId)
  VALUES (((SELECT Id From Users Where UserName='${body.UserName}')),'${body.ClientId}')
  INSERT INTO TypeOfPerformers(Performers_Id,PerformerTypes_Id)
  VALUES ((SELECT Id From Users Where UserName='${body.UserName}'),'${body.PerformerTypes_Id}');
    COMMIT TRAN T1;
  `
   return SuperPerformer.sequelize.query(raw, {
    replacements:[''],
    type: Sequelize.QueryTypes.INSERT
   })
  // return (await SuperPerformer.create(body)).get({ plain: true })
}


const updateOne = async (Id,body) => {

  body.Password = await method.hashPassword(body.Password)
   //   console.log("1111111111111111111", body.Password)

  // let ApplicationId='04B61B6C-DB3B-49DB-B854-42F3654AD0D2';
  let AdminId='3CAE92A2-6F11-4BC8-8F7D-F0E7057C63B7';
  const raw =  
    `
    UPDATE  Users 
    SET FirstName='${body.FirstName}',LastName='${body.LastName}'
    WHERE Users.Id='${Id}';

    UPDATE  aspnet_Users 
    SET LoweredUserName='${body.UserName}', MobileAlias='${body.Mobile}', IsAnonymous='${body.IsAnonymous}', LastActivityDate='${body.CreateDate}'
    WHERE aspnet_Users.UserId='${Id}';
    UPDATE  aspnet_UsersInRoles
    SET RoleId='${AdminId}'
    WHERE aspnet_UsersInRoles.UserId='${Id}';
    UPDATE  aspnet_Membership
    SET Password='${body.Password}',MobilePIN='${body.Mobile}',
    Email='${body.Email}',LoweredEmail='${body.Email}',
    IsApproved='${body.IsApproved}',IsLockedOut='${body.IsLockedOut}',LastLoginDate='${body.CreateDate}',
    LastLockoutDate='${body.CreateDate}'
    WHERE aspnet_Membership.UserId='${Id}';
     
    UPDATE Users_Client
    SET CompanyName='${body.CompanyName}',ReportType='${body.ReportType}'
    WHERE Users_Client.Id='${Id}';

    UPDATE Users_Auditor
    SET Mobile='${body.Mobile}',Phone='${body.Phone}'
    WHERE Users_Auditor.Id='${Id}';

    UPDATE ClientAuditor
    SET  ClientId='${body.ClientId}'
    WHERE ClientAuditor.AuditorId='${Id}';
    
    UPDATE TypeOfPerformers
    SET  PerformerTypes_Id= ${body.PerformerTypes_Id}
    WHERE TypeOfPerformers.Performers_Id='${Id}';
    `
     return SuperPerformer.sequelize.query(raw, {
      replacements:[''],
      type: Sequelize.QueryTypes.SELECT
     })
    }

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  return SuperPerformer.findAndCountAll({
    where: condition,
    ...option,
    include: ['Country', 'Branch', 'User'],
    order: [['UserClient.CompanyName', 'ASC']]
  })
}

const findAllJoin = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  return SuperPerformer.findAndCountAll({
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
  return SuperPerformer.count(query)
}

const destroy = async (Id) => {
  const raw =
  `DELETE  aspnet_Membership
  WHERE UserId='${Id}';
  `
   return SuperPerformer.sequelize.query(raw, {
    replacements:[Id],
    type: Sequelize.QueryTypes.DELETE
   })
}


const rawQueryListFilter = async (qwery,body) => {
  console.log(body)
   const raw =
   `  SELECT *  FROM  aspnet_Roles
   inner join aspnet_UsersInRoles on aspnet_Roles.RoleId=aspnet_UsersInRoles.RoleId
   inner join aspnet_Users on aspnet_UsersInRoles.UserId=aspnet_Users.UserId
   inner join aspnet_Membership on aspnet_Users.UserId=aspnet_Membership.UserId   inner join Users on aspnet_Users.UserName=Users.UserName
   inner join Emails on Users.Id=Emails.UserId
   inner join Users_Auditor on Users.Id=Users_Auditor.Id
   inner join TypeOfPerformers on Users_Auditor.Id= TypeOfPerformers.Performers_Id
   inner join PerformerType on TypeOfPerformers.PerformerTypes_Id=PerformerType.Id
   inner join ClientAuditor on Users_Auditor.Id=ClientAuditor.AuditorId
   inner join Users_Client on ClientAuditor.ClientId=Users_Client.Id
   where aspnet_Roles.RoleId='DAF570A4-5AD9-4D52-B4FB-171C4A759A06'
    AND Users_Client.CompanyName='${body.CompanyName}'
    AND PerformerType.Name='${body.Name}'
    AND TypeOfPerformers.PerformerTypes_Id='${body.PerformerTypes_Id}'
   `
   return SuperPerformer.sequelize.query(raw, {
     replacements:[body],
     type: Sequelize.QueryTypes.SELECT
    })
  }

const rawQueryList = async () => {
  const raw = 
  `
  SELECT *
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
  where aspnet_Roles.RoleId='3CAE92A2-6F11-4BC8-8F7D-F0E7057C63B7' 
  `
   return SuperPerformer.sequelize.query(raw, {
     type: Sequelize.QueryTypes.SELECT
   })
 }

const rawID = async (Id) =>
{
 let  RoleId='3CAE92A2-6F11-4BC8-8F7D-F0E7057C63B7';
 const raw = 
  `
  SELECT * 
 
  FROM  [fdis].[dbo].[Users]

  inner join [fdis].[dbo].[aspnet_Users] on Users.UserName=aspnet_Users.UserName

  inner join [fdis].[dbo].[aspnet_UsersInRoles] on aspnet_Users.UserId=aspnet_UsersInRoles.UserId

  inner join [fdis].[dbo].[aspnet_Membership] on aspnet_Users.UserId=aspnet_Membership.UserId

  inner join  [fdis].[dbo].[Users_Auditor] on Users.Id=Users_Auditor.Id

  inner join [fdis].[dbo].[TypeOfPerformers] on Users_Auditor.Id= TypeOfPerformers.Performers_Id

  inner join [fdis].[dbo].[ClientAuditor] on Users_Auditor.Id=ClientAuditor.AuditorId

  inner join [fdis].[dbo].[Users_Client] on ClientAuditor.ClientId=Users_Client.Id

  where  [fdis].[dbo].[Users].Id='${Id}' 

  ` 
 return SuperPerformer.sequelize.query(raw, {
  replacements:[Id],
  type: Sequelize.QueryTypes.SELECT
 })
}



// inner join aspnet_Users on aspnet_UsersInRoles.UserId=aspnet_Users.UserId

// inner join aspnet_UsersInRoles on aspnet_Roles.RoleId=aspnet_UsersInRoles.RoleId

// inner join aspnet_Membership on aspnet_Users.UserId=aspnet_Membership.UserId

export default {

  findById,
  findAll,
  create01,
  findOne,
  updateOne,
  countDocuments,
  destroy,
  findAllJoin,
  rawQueryList,
  rawQueryListFilter,
  rawID

}
