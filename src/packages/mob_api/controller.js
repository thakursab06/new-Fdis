import { pick } from 'lodash'
import { handleResponse } from '../../utils/handle-response'
import to from '../../utils/to'
import service from './service'
import config from './config'

const auth = async (req, res) => {
  const [error, data] = await to(service.auth(req.body))
  handleResponse(error, data, req, res)
}

const authorizetion = async (req, res) => {
  const [error, data] = await to(service.authorizetion(req.headers))
  handleResponse(error, data, req, res)
}

async function Audit_list(req, res) {
  const [error, result] = await to(service.Audit_list(req.query,req.headers))
  return handleResponse(error, result, req, res)
}

async function  CompanyDetail(req, res) {
  const [error, result] = await to(service.CompanyDetail(req.query))
  return handleResponse(error, result, req, res)
}

async function  CategoryById(req, res) {
  const [error, result] = await to(service.CategoryById(req.params.id))
  return handleResponse(error, result, req, res)
}
async function  Areaname(req, res) {
  const [error, result] = await to(service.Areaname(req.params.id))
  return handleResponse(error, result, req, res)
}
async function  ElementCount(req, res) {
  const [error, result] = await to(service.ElementCount(req.params.id))
  return handleResponse(error, result, req, res)
}
async function  AuditPresent(req, res) {
  const [error, result] = await to(service.AuditPresent(req.params.id))
  return handleResponse(error, result, req, res)
}
async function  createAudit(req, res) {
  const [error, result] = await to(service.createAudit(req.body,req.files))
  return handleResponse(error, result, req, res)
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
