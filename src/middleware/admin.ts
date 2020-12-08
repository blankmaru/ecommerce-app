import { Request, Response } from 'express'
import { NextFunction } from "express"
import User from '../models/user.model'

// Admin Middleware
export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { user }: any = req
    if (user) {
        User.findOne({ username: user.username }).then((doc: any) => {
            if (doc.isAdmin) next()
            return res.status(400).send({ success: false })
        })
    } else {
        return res.status(400).send({ message: 'Permission denied!' })
    }
}