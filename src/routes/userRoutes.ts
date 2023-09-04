import express from 'express'
import { UserController } from '../controller/userController'
import { checkAuthentification } from '../middleware/auth'

const userRoutes = express.Router()

userRoutes.post('/register', UserController.register)
userRoutes.post('/login', UserController.login)
userRoutes.get('/profile', checkAuthentification, UserController.profile)
userRoutes.put('/profile', checkAuthentification, UserController.updateUserInformation)
userRoutes.put('/profile/password', checkAuthentification, UserController.changePassword)
userRoutes.delete('/profile', checkAuthentification, UserController.deleteUser)

export default userRoutes
