import { Request, Response } from 'express'
import Category from '../models/category.model'

import { logger } from '../log/logger'

export const getAllCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        await Category.find()
            .then(async (docs) => {
                res.send(docs)
            })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const addCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { name, createdBy } = req?.body
        if (!name || typeof name !== 'string' || !createdBy || typeof createdBy !== 'string') return res.status(400).send({ message: 'All fields require' })
        await Category.findOne({ name: name }).then( async (doc) => {
            if (doc) return res.status(400).send({ message: 'Category already exist' })
            if (!doc) {
                const newCategory = new Category({ name, createdBy })
                await newCategory.save().then( async () => {
                    logger.info({ message: 'add category success' })
                    return res.send({ message: 'success' })
                })
            }
        })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const deleteCategoryById = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category) res.status(404).send('not found')
        res.send({ message: 'success' })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}