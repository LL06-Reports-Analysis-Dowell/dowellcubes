import { Router } from 'express'
import apiController from '../controller/apiController.js'

const router = Router()

router.route('/self').get(apiController.self)
router.route('/health').get(apiController.health)
router.route('/create-db-collection').post(apiController.createCollection)
router.route('/check-db-status/:workspaceId').get(apiController.checkDatabaseStatus)
router.route('/register').post(apiController.register)

export default router