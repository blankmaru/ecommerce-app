import express from 'express'
const router = express.Router()

import {
    getAllProducts,
    addProduct,
    getProductById,
    updateProductById,
    deleteProductById
} from '../controllers/product.controller'

// Product Routes
router.get('/', getAllProducts)
router.post('/', addProduct)
router.get('/:id', getProductById)
router.patch('/:id', updateProductById)
router.delete('/:id', deleteProductById)

export default router