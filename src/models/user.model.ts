import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema)

export default User