import express from 'express'
import { json } from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import passportLocal from 'passport-local'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bcrypt from 'bcryptjs'

const app = express()
import * as dotenv from "dotenv";
dotenv.config();

const LocalStrategy = passportLocal.Strategy

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(
    session({
        secret: process.env.secretcode || 'secret',
        resave: true,
        saveUninitialized: true
    })
)
app.use(passport.initialize())
app.use(passport.session())

const port = process.env.PORT || 5000

app.listen(port)