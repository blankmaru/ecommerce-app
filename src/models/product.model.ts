import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }, 
    img: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product