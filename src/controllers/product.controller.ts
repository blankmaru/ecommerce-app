import { Request, Response } from 'express'
import Product from '../models/product.model'

import { GET_ASYNC, SET_ASYNC } from '../server'
import { logger } from '../log/logger'

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
        const { name, desc, price, img, postedBy } = req?.body
        if (!name || typeof name !== 'string' ||
            !desc || typeof desc !== 'string' ||
            !price || typeof price !== 'number' ||
            //!img || typeof img !== 'string' ||
            !postedBy || typeof postedBy !== 'string')
            return res.status(400).send({ message: 'All fields require' })
        await Product.findOne({ name: name }).then( async (doc) => {
            if (doc) return res.status(400).send({ message: 'Product already exist' })
            if (!doc) {
                const newProduct = new Product({ name,desc,price,img,postedBy })
                await newProduct.save().then( async () => {
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
        const reply = await GET_ASYNC('product')
        if (reply) {
            res.send(JSON.parse(reply))
            return
        }

        await Product.findById(id).then( async (doc) => {
            const saveResult = await SET_ASYNC('product', JSON.stringify(doc))
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