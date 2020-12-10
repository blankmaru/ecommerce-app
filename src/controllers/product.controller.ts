import { Request, Response } from 'express'
import Product from '../models/product.model'

import { logger } from '../log/logger'
import Category from '../models/category.model'

export const getAllProducts = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        await Product.find()
        .then(async (docs) => {
            res.send(docs)
        })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const addProduct = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const { name, desc, price, img, category, postedBy } = req?.body
        if (!name || typeof name !== 'string' ||
            !desc || typeof desc !== 'string' ||
            !price || typeof price !== 'number' ||
            !postedBy || typeof postedBy !== 'string' ||
            !category || typeof category !== 'string')
            return res.status(400).send({ message: 'All fields require' })
        await Product.findOne({ name: name }).then( async (doc) => {
            if (doc) return res.status(400).send({ message: 'Product already exist' })
            if (!doc) {
                const newProduct = new Product({ name, desc, price, img, category, postedBy })
                await newProduct.save().then( async () => {
                    await Category.findOne({ name: category }).then( async (doc: any) => {
                        await doc.products.push(newProduct)
                        doc.save()
                    })
                    logger.info({ message: 'add product success' })
                    return res.send({ message: 'success' })
                })
            }
        })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const getProductById = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const id = req.params.id

        await Product.findById(id).then( async (doc) => {
            res.status(200).send(doc)
        })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const updateProductById = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req?.body).then( async (doc) => {
            await doc?.save()
            return res.send({ message: 'success'})
        })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}

export const deleteProductById = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) res.status(404).send('not found')
        res.send({ message: 'success' })
    } catch(err) {
        logger.error({ error: err })
        return res.status(400).json({ error: err })
    }
}