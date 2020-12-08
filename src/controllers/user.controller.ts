import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.model'

// import { GET_ASYNC, SET_ASYNC } from '../server'

export const register = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { username, email, password } = req?.body
        if (!username || !email || !password || typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid values'})
        }

        User.findOne({ username: username })
            .then( async (doc) => {
                if (doc) return res.status(400).json({ message: 'User already registered' })
                if (!doc) {
                    const hashedPassword = await bcrypt.hash(password, 10)
                    const newUser = new User({
                        username,
                        email,
                        password: hashedPassword
                    })
                    await newUser.save()
                    return res.status(200).json({ message: 'User successfully registered!'})
                }
            })
    } catch(err) {
        return res.status(400).json({ error: err })
    }
}

export const login = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        return res.status(200).json({ auth: true })
    } catch(err) {
        return res.status(400).json({ error: err })
    }
}

export const user = async (req: Request, res: Response): Promise<Response | undefined> => {
    return res.send(req.user)
}

export const logOut = async (req: Request, res: Response): Promise<Response | undefined> => {
    req.logOut()
    return res.status(200).json({ success: true })
}

// User CRUD

export const getUsers = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        // const reply = await GET_ASYNC('users')
        // if (reply) {
        //     res.send(JSON.parse(reply))
        //     return
        // }
        await User.find()
        .then(async (docs) => {
            // const saveResult = await SET_ASYNC('users', JSON.stringify(docs))
            res.send(docs)
        })
    } catch(err) {
        return res.status(400).send({ error: err })
    }
}
