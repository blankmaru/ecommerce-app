import nodemailer from 'nodemailer'
import { GMAIL_USER, GMAIL_USER_PASSWORD } from './config/keys'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_USER_PASSWORD
    },
});
