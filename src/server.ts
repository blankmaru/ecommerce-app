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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
app.use(cors({credentials: true, origin: 'http://159.65.114.180'}))
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
import categoryRoutes from './routes/category.routes'

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

// Uploading files

const conn = mongoose.createConnection(mongoURI);

import multer from 'multer';
import Grid from 'gridfs-stream';
import GridFsStorage from 'multer-gridfs-storage';

let gfs: any;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req: any, file: any) => {
      return {
        filename: 'file_' + Date.now()
      };
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    res.send({ file: req.file })
})

app.get('/files', (req, res) => {
    gfs.files.find().toArray((err: Error, files: any) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
              err: 'No files exist'
            });
        }
      
        return res.json(files);
    })
})

app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err: Error, file: any) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
              err: 'No file exist'
            });
        }

        return res.json(file);
    })
})

app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err: Error, file: any) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
              err: 'No file exists'
            });
        }

        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);               
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    })
})

app.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err: Error, gridStore: any) => {
        if (err) {
            return res.status(404).json({ err: err })
        }
    })
})

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/category', categoryRoutes)

const port = process.env.PORT || 5000

app.listen(port)