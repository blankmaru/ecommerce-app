import express from 'express'
import { json } from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import passportLocal from 'passport-local'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import mongoose from 'mongoose'

import responseTime from 'response-time'

const app = express()
import * as dotenv from "dotenv";
dotenv.config();

import { mongoURI } from './config/keys'

const LocalStrategy = passportLocal.Strategy
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(responseTime())
app.use(json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(
    session({
        // store: new RedisStore({client: client}),
        secret: process.env.secretcode || 'secret',
        resave: true,
        saveUninitialized: true
    })
)
app.use(passport.initialize())
app.use(passport.session())

import User from './models/user.model'
import { IDatabaseUser } from './interface/UserInterface'

import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'

passport.use('local', new LocalStrategy( async (username: string, password: string, done) => {
    await User.findOne({ username: username }, (err: Error, user: IDatabaseUser) => {
        if (err) return done(err)
        if (!user) return done(null, false)
        return done(null, user)
    })
}))

passport.serializeUser((user: IDatabaseUser, cb) => {
    cb(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
    User.findById(id, function(err: Error, user: IDatabaseUser) {
        done(err, user);
    });
})

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)

const port = process.env.PORT || 5000

app.listen(port)