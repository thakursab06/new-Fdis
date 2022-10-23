import express from 'express'
import controller from './controller'
// import { adminAuthentication } from '../../middleware';

const router = express.Router()

router.post('/', controller.create)
router.patch('/:id', controller.update)
router.get('/', controller.index)
router.post('/filter', controller.filter)
router.get('/:id', controller.show)
router.delete('/:id', controller.deleteRecord)

export default router
