import expressAsyncHandler from "express-async-handler"
import { Router } from "express"
import * as UserController from './user.controller.js'
const router = Router()

router.post('/signup', expressAsyncHandler(UserController.Signup))
router.post('/signin', expressAsyncHandler(UserController.Signin))
router.put('/', expressAsyncHandler(UserController.UpdateUser))
router.delete('/', expressAsyncHandler(UserController.DeleteUser))
router.get('/', expressAsyncHandler(UserController.GetUser))


export default router