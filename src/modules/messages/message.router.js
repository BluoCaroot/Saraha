import expressAsyncHandler from "express-async-handler"
import { Router } from "express"
import * as MessageController from './message.controller.js'
const router = Router()

router.get('/:loggedinID', expressAsyncHandler(MessageController.ViewMessages))
router.post('/', expressAsyncHandler(MessageController.SendMessage))
router.delete('/', expressAsyncHandler(MessageController.DeleteMessage))

export default router