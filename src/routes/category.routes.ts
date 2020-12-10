import express from 'express'
import { cacheMiddleware } from '../caching'
const router = express.Router()

import {
    getAllCategory,
    addCategory,
    deleteCategoryById
} from '../controllers/category.controller'

// Category Routes
router.get('/', cacheMiddleware(30), getAllCategory)
router.post('/', addCategory)
router.delete('/:id', deleteCategoryById)

export default router