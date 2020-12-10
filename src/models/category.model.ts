import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    products: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Category = mongoose.model('Category', categorySchema)

export default Category