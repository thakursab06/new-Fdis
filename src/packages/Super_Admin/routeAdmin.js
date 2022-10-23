import express from 'express'
import controller from './controller'
const router = express.Router()

router.post('/', controller.create)
router.patch('/:id', controller.update)
router.get('/', controller.index)
router.get('/:id', controller.show)
router.delete('/:id', controller.deleteRecord)


export default router
