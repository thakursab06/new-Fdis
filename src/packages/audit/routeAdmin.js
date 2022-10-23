import express from 'express'
import controller from './controller'
// import { adminAuthentication } from '../../middleware';
import validator from '../validator'

const router = express.Router()

router.post('/', validator.audit.create, controller.create)
router.patch('/:id', controller.update)
router.get('/join', controller.indexJoin)
router.get('/', controller.index)
router.get('/:id', controller.show)
router.delete('/:id', controller.deleteRecord)
router.get('/clientlocation',controller.locationbyclient)

export default router
