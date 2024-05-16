import expressAsyncHandler from "express-async-handler"
import { Router } from "express"
import * as MessageController from './message.controller.js'
import {auth} from '../../middlewares/auth.middleware.js'
const router = Router()

router.get('/', auth(), expressAsyncHandler(MessageController.ViewMessages))
router.post('/', expressAsyncHandler(MessageController.SendMessage))
router.delete('/', expressAsyncHandler(MessageController.DeleteMessage))

export default router