import express from 'express'
import controller from './controller'
import token from'./repository'
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const multer = require('multer')
const router = express.Router()
const upload = multer({ dest: 'uploads/' })


router.post('/', controller.auth)
router.post('/auth', controller.authorizetion)
router.get('/audit',controller.Audit_list)
router.get('/companyDetail',controller.CompanyDetail)
router.get('/categorybyID/:id',controller.CategoryById)
router.get('/area/:id',controller.Areaname)
router.get('/elementcount/:id',controller.ElementCount)
router.get('/auditPresent/:id',controller.AuditPresent)
router.post('/audit',upload.fields([
    { name: 'LogbookImage'},
    { name: 'TechnicalAspectsImage'}
  ]),controller.createAudit)
export default router
