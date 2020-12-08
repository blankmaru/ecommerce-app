import express from 'express'
const router = express.Router()
import passport from 'passport'

import {
    register,
    login,
    user,
    logOut,
    getUsers,
    updateUserById,
    deleteUserById
} from '../controllers/user.controller'
import { isAdminMiddleware } from '../middleware/admin'

// Auth Routes
router.post('/register', register)
router.post('/login', passport.authenticate('local'), login)
router.get('/user', user)
router.get('/logOut', logOut)

router.get('/', getUsers)
router.patch('/:id', updateUserById)

// Admin routes
router.delete('/:id', isAdminMiddleware, deleteUserById)

export default router
