import express, { NextFunction, Request } from 'express'
import { cacheMiddleware } from '../caching'
const router = express.Router()

import {
    getAllProducts,
    addProduct,
    getProductById,
    updateProductById,
    deleteProductById
} from '../controllers/product.controller'

// Product Routes
router.get('/', cacheMiddleware(30), getAllProducts)
router.post('/', addProduct)
router.get('/:id', getProductById)
router.patch('/:id', updateProductById)
router.delete('/:id', deleteProductById)

export default router