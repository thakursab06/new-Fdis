/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import repo from './repository'
import { commonLocale } from '../../locales'

async function auth(body) {
  console.log(body)
 const data = await repo.findOne({
    UserName: body.username,
  })
  if(data == null)
  {
    throw new Error(JSON.stringify(commonLocale.authenticationInfoNotFound))
  }
  return repo.auth(body)
}

async function authorizetion(headers) {
  return repo.authorizetion(headers)
}

async function Audit_list(query,headers) {
  return repo.Audit_list(query,headers)
} 

async function CompanyDetail(query) {
  return repo.CompanyDetail(query)
} 

async function CategoryById(id) {
  return repo.CategoryById(id)
} 

async function Areaname(id) {
  return repo.Areaname(id)
} 

async function ElementCount(id) {
  return repo.ElementCount(id)
} 

async function AuditPresent(id) {
  return repo.AuditPresent(id)
}

async function createAudit(body,files) {
  return repo.createAudit(body,files)
}



export default {
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
