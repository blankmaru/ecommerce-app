import express from 'express'
const router = express.Router()
import passport from 'passport'

import {
    register,
    login,
    user,
    logOut,
    getUsers
} from '../controllers/user.controller'

router.post('/register', register)
router.post('/login', passport.authenticate('local'), login)
router.get('/user', user)
router.get('/logOut', logOut)

router.get('/', getUsers)

export default router
