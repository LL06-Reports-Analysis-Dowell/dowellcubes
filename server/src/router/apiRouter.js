import { Router } from 'express'
import apiController from '../controller/apiController.js'
import authentication from '../middleware/authentication.js'

const router = Router()

router.route('/self').get(apiController.self)
router.route('/health').get(apiController.health)
router.route('/create-db-collection').post(apiController.createCollection)
router.route('/check-db-status/:workspaceId').get(apiController.checkDatabaseStatus)
router.route('/sign-up').post(apiController.register)
router.route('/sign-in/admin').post(apiController.adminLogin)
router.route('/sign-in/public').post(apiController.publicLogin)
router.route('/self-identification').get(authentication,apiController.selfIdentification)


export default router