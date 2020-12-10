import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.model'

import { logger } from '../log/logger'
import { sendSms } from '../twilio'
import { transporter } from '../nodemailer'
import { GMAIL_USER } from '../config/keys'

export const register = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { username, email, phone, password } = req?.body
        if (!username || !email || !password || typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid values'})
        }

        const mailOptions = {
            from: GMAIL_USER,
            to: email,
            subject: 'Registration',
            text: 'You was successfully registered!'
        };

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
                    let welcome = ''
                    if (phone) {
                        welcome = `registration success`
                        sendSms(phone, welcome)
                    }
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                    }); 
                    return res.status(200).json({ messageSend: welcome })
                }
            })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const login = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        return res.status(200).json({ auth: true })
    } catch(err) {
        logger.error({ error: err })
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
        await User.find()
        .then((docs) => {
            res.status(200).send(docs)
        })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).send({ error: err })
    }
}

export const updateUserById = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        await User.findByIdAndUpdate(req.params.id, req?.body).then( async (doc) => {
            await doc?.save()
            return res.send({ message: 'success'})
        })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const deleteUserById = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) res.status(404).send('not found')
        res.send({ message: 'success' })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}
