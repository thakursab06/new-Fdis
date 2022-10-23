import { SuperUserSeq,SuperUser,UserSeq,AuditSeq,AreaDescriptionSeq,CategorySe,ElementTypeSeq,FormErrorElement,ImgSeq} from '../../models';
import {Sequelize}from 'sequelize'
import method from './method'
import { commonLocale } from '../../locales'
const jwt = require('jsonwebtoken');
const multer = require('multer')
const uplodeRepo=require('../Img_Uplode/repository')
const fs = require('fs')
const path = require('path');

async function findOne(query) {
  return SuperUserSeq.findOne({
    where: {
      ...query
    }
  });
}

async function findOnepwd(query) {
  return SuperUser.findOne({
    where: {
      ...query
    }
  });
}


//----------------------Login -------------------
const auth = async (body) => {
  const username= body.username;
  const secretkey='FDIS8EC40090-E1F0-4CF6'
  //------------------finding UserID--------------------------//
  const data = await findOne({
    UserName: body.username,
  })
  const userid=data.UserId;
  //-------------------------------------------------------//

  //------------------Finding Password----------------------//
  const data1 = await findOnepwd({
    UserId: userid,
  })
  const pwd=data1.Password;
  //-------------------------------------------------------//
  
  const comparepwd= await method.comparePassword(body.password, pwd)
  if(comparepwd) {
    const token = jwt.sign({ username },secretkey, { expiresIn: '720h' })
    const res= {"code":200, "Message":'Login Successfully' , 'Username':body.username ,'Token':token}
   return(res)
  }
  else{
    throw new Error(JSON.stringify(commonLocale.loginFailed));
  }
  
}

const authorizetion=async(headers)=>{
  const security = process.env.TOKEN;
  const token=headers["x-access-token"];

if (!token) {
  const res= {"code":403, "Message":'A token is required for authentication'}
  return res
}
try {
  const decoded = jwt.verify(token, security);
  const user = decoded;
  return(user);
} catch (err) {
  return(err)
}

}

const Audit_list= async(query,headers)=>{
  const authdata = await authorizetion(headers);
  const username=authdata.username;
  const raw=`select U.Id from Users as U inner join aspnet_Users as UA on U.UserName=UA.UserName where UA.UserName='Alcmaria'`
  const data = await UserSeq.sequelize.query(raw, {
    replacements:[username],
    type: Sequelize.QueryTypes.SELECT
    })
    const Id=data[0].Id
  const raw1=`select Id,LocationClient_Id,NameClient_Id from Audits where  NameClient_Id='${Id}'`
  return AuditSeq.sequelize.query(raw1, {
    replacements:[Id],
    type: Sequelize.QueryTypes.SELECT
    })
}


const CompanyDetail = async (query) => {
  console.log("Audit Id", query.AuditId)
  console.log("clinet Id", query.clientId)
  const AuditId= query.AuditId;
  const clientId= query.clientId;
  const raw = 
  ` SELECT [AuditCode],[CompanyName],[Type],[Name] as Location_Name
  FROM [fdis].[dbo].[Audits] as a inner join [fdis].[dbo].[Users_Client] as UC on a.NameClient_Id = UC.Id
  inner join [fdis].[dbo].[Buildings] as b on b.Id =a.LocationClient_Id 
  where a.Id='${AuditId}' 
  SELECT [CategoryId],CategoryName
  FROM [fdis].[dbo].[Client_Category] as cc 
  inner join  [fdis].[dbo].[Categories] as c on c.Id =cc.CategoryId where ClientId='${clientId}' `
   return AuditSeq.sequelize.query(raw, {
    replacements:[AuditId,clientId],
    type: Sequelize.QueryTypes.SELECT
   })
 }

 const CategoryById=async (id) => {
  const clientId=id;
  const raw = 
  `SELECT [CategoryId],CategoryName
  FROM [fdis].[dbo].[Client_Category] as cc 
  inner join  [fdis].[dbo].[Categories] as c on c.Id =cc.CategoryId where ClientId='${clientId}' `
   return AuditSeq.sequelize.query(raw, {
    replacements:[clientId],
    type: Sequelize.QueryTypes.SELECT
   })
 }

 const Areaname=async (id) => {
  const categoryID=id;
  const raw = 
  `SELECT  [CategoryId],[AreaDescId],[AreaDescModuleId],[Name]
   FROM [fdis].[dbo].[Category_AreaDescription] as CA inner join AreaDescriptions as A on A.Id=CA.AreaDescId where CategoryId='${categoryID}' `
   return AreaDescriptionSeq.sequelize.query(raw, {
    replacements:[categoryID],
    type: Sequelize.QueryTypes.SELECT
   })
 }

 const ElementCount=async (id) => {
  const AuditID=id;
  const raw = 
  `SELECT TOP (1000) count([IdElement]) as ElementCount
  FROM [fdis].[dbo].[ElementAudit] where IdAudit='${AuditID}' `
   return ElementTypeSeq.sequelize.query(raw, {
    replacements:[AuditID],
    type: Sequelize.QueryTypes.SELECT
   })
 }

 const AuditPresent=async(id)=>{
  const AuditID=id;
  const raw = `SELECT * FROM [fdis].[dbo].[Audits] where Activate='1' and Id='${AuditID}'`
  const result = await AuditSeq.sequelize.query(raw, {
    replacements:[AuditID],
    type: Sequelize.QueryTypes.SELECT
   })
  
  if(result==0){
    const res= {"code":201, "Message":'Audit is Not Present'}
    return res
  }else{
    console.log(" Audit is present")
    return result
    
  }
   
 }

 const createAudit = async(body,files)=> {
    const uplodeImagesLogbook = await uplodeRepo.default.uplode(files.LogbookImage[0])
    
    const uplodeImagesTechnicalAspect = await uplodeRepo.default.uplode(files.TechnicalAspectsImage[0])
     
  const raw =  `INSERT INTO [dbo].[FormErrorElement]([FormId],[ErrorTypeId] ,[ElementId] ,[Logbook] ,[TechnicalAspects] ,[LogbookImage],[TechnicalAspectsImage] ,[Count])
  VALUES
  ('${body.FormId}'
  ,'${body.ErrorTypeId}'
  , '${body.ElementId}'
  ,'${body.Logbook}'
  ,'${body.TechnicalAspects}'
  ,'${uplodeImagesLogbook}'
  ,'${uplodeImagesTechnicalAspect}'
  ,${body.Count}
  )`
  const response =  await FormErrorElement.sequelize.query(raw, {
    replacements:[''],
    type: Sequelize.QueryTypes.INSERT
   })
  return response;
}

export default {
  findOne,
  auth,
  authorizetion,
  Audit_list,
  CompanyDetail,
  CategoryById,
  Areaname,
  ElementCount,
  AuditPresent,
  createAudit,
  
}
