import { Sequelize } from 'sequelize';
import { SuperAdminSeq} from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'

import method from './method'

const findById = async (Id) =>
{
const raw = `
select * from [fdis].[dbo].[aspnet_Roles]  as R inner join [fdis].[dbo].[aspnet_UsersInRoles] as URole on R.RoleId=URole.RoleId 
inner join [fdis].[dbo].[aspnet_Membership] as UM  on UM.UserId=URole.[UserId] 
inner join [fdis].[dbo].[aspnet_Users] as U on U.UserId =  UM.UserId
inner join [fdis].[dbo].[Users] as RM on RM.Id = UM.UserId
where R.RoleId='6BF066DD-C1CF-4F0B-B982-7555DE280212' and UM.UserId='${Id}' 
 ` 
 return SuperAdminSeq.sequelize.query(raw, {
  replacements:[Id],
  type: Sequelize.QueryTypes.SELECT
 })
}

async function findOne(query) {
  return SuperAdminSeq.findOne({
    where: {
      ...query
    }
  });
}

const create = async (body) => {
  console.log("Pass", body.Password)
  body.Password = await method.hashPassword(body.Password)
      
let ApplicationId='04B61B6C-DB3B-49DB-B854-42F3654AD0D2';
let AdminId='6BF066DD-C1CF-4F0B-B982-7555DE280212';
  const raw =  
  `BEGIN TRAN T1;
  INSERT INTO Users (UserName,FirstName,LastName)
  VALUES('${body.UserName}','${body.FirstName}','${body.LastName}') ;
  INSERT INTO aspnet_Users (ApplicationId,UserId,UserName,LoweredUserName,MobileAlias,IsAnonymous,LastActivityDate)
  VALUES('${ApplicationId}',(SELECT Id From Users Where UserName='${body.UserName}'),
  '${body.UserName}','${body.UserName}','${body.Mobile}',
  '${body.IsAnonymous}','${body.LastActivityDate}');
  INSERT INTO aspnet_UsersInRoles(RoleId,UserId)
  VALUES('${AdminId}',(SELECT Id From Users Where UserName='${body.UserName}'));
  INSERT INTO aspnet_Membership (ApplicationId,UserId,Password,PasswordFormat,PasswordSalt,MobilePIN,Email,LoweredEmail,PasswordQuestion,PasswordAnswer,IsApproved,IsLockedOut,CreateDate,LastLoginDate,LastPasswordChangedDate,LastLockoutDate,FailedPasswordAttemptCount,FailedPasswordAttemptWindowStart,FailedPasswordAnswerAttemptCount,FailedPasswordAnswerAttemptWindowStart,Comment)
  VALUES('${ApplicationId}',(SELECT Id From Users Where UserName='${body.UserName}'),'${body.Password}','${body.PasswordFormat}','${body.PasswordSalt}',
  '${body.MobilePIN}','${body.Email}','${body.LoweredEmail}','${body.PasswordQuestion}','${body.PasswordAnswer}', '${body.IsApproved}','${body.IsLockedOut}','${body.CreateDate}', '${body.LastLoginDate}','${body.LastPasswordChangedDate}','${body.LastLockoutDate}','${body.FailedPasswordAttemptCount}','${body.FailedPasswordAttemptWindowStart}','${body.FailedPasswordAnswerAttemptCount}','${body.FailedPasswordAnswerAttemptWindowStart}','${body.Comment}');
   COMMIT TRAN T1;
  `
   return SuperAdminSeq.sequelize.query(raw, {
    replacements:[''],
    type: Sequelize.QueryTypes.INSERT
   })
 
  // return (await SuperPerformer.create(body)).get({ plain: true })
}

const updateOne = async (Id,body) => {

    // let ApplicationId='04B61B6C-DB3B-49DB-B854-42F3654AD0D2';
    
    console.log("Pass", body.Password)
    body.Password = await method.hashPassword(body.Password)
    console.log("Hashed", body.Password)

    let AdminId='6BF066DD-C1CF-4F0B-B982-7555DE280212';
    
    

    const raw =  
      `
      BEGIN TRAN T1;
      UPDATE  Users 
      SET FirstName='${body.FirstName}',LastName='${body.LastName}'
      WHERE Users.Id='${Id}';
      UPDATE  aspnet_Users 
      SET  MobileAlias='${body.MobileAlias}', IsAnonymous='${body.IsAnonymous}', LastActivityDate='${body.LastActivityDate}'
      WHERE aspnet_Users.UserId='${Id}';
      UPDATE  aspnet_Membership
      SET Password='${body.Password}',MobilePIN='${body.Mobile}',
      Email='${body.Email}',LoweredEmail='${body.Email}',
      IsApproved='${body.IsApproved}',IsLockedOut='${body.IsLockedOut}',LastLoginDate='${body.LastActivityDate}',
      LastPasswordChangedDate='${body.LastActivityDate}'
      WHERE aspnet_Membership.UserId='${Id}';
      COMMIT TRAN T1;
      `
       return SuperAdminSeq.sequelize.query(raw, {
        replacements:[''],
        type: Sequelize.QueryTypes.SELECT
       })
}



  const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  return SuperAdminSeq.findAndCountAll({
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

  return SuperAdminSeq.findAndCountAll({
  
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
  return SuperAdminSeq.count(query)
}

const destroy = async (Id) => {
  const raw =  
  `
   DELETE FROM Users WHERE Id='${Id}';
    DELETE FROM aspnet_Users WHERE UserId='${Id}';
    DELETE FROM aspnet_Membership where UserId='${Id}' ; 
    DELETE FROM aspnet_UsersInRoles Where UserId='${Id}';
  `
   return SuperAdminSeq.sequelize.query(raw, {
    replacements:[Id],
    type: Sequelize.QueryTypes.DELETE
   })
  }

const rawQueryList = async (req) => {
  let user;
  let pass;
 const raw = `select * from [fdis].[dbo].[aspnet_Roles]  as R inner join [fdis].[dbo].[aspnet_UsersInRoles] as URole on R.RoleId=URole.RoleId 
 inner join [fdis].[dbo].[aspnet_Membership] as UM  on UM.UserId=URole.[UserId] inner join [fdis].[dbo].[aspnet_Users] as U on U.UserId =  UM.UserId
 inner join [fdis].[dbo].[Users] as RM on RM.Id = UM.UserId
 where R.RoleId='6BF066DD-C1CF-4F0B-B982-7555DE280212'
 `
  return SuperAdminSeq.sequelize.query(raw, {
    replacements:['admins','HBg9f2fPb6MzqKnZXQoCrM8IWKE='],
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
  rawQueryList,
  // findAllByRole
  
}
