const express = require('express')
const Category = require('..//models/category')
const Subcategory = require('../models/subcategory')
const log = require('../logs/logger')
const Product = require('../models/product')
const fs = require('fs')
const { Op, Sequelize } = require('sequelize')
const Logger = require('bunyan')


const createProduct = async (req, res) => {
    try {
        log.info('Incoming request to createProduct', { "request": req.body })
            if (req.body.subcategory) {
                const { category, subcategory, ...others } = req.body
                log.debug('get category id', req.categoryId)
                log.debug('get category id', req.subcategoryId)
                const newProduct = await Product.create({ ...others, image: req.file.path, category_id: req.categoryId, subcategory_id: req.subcategoryId })
                log.info('Outgoin response from createProduct', { "respone": newProduct.dataValues })
                res.status(201).send({ "success": 201, "message": "Product added successfully by admin", "data": newProduct.dataValues })
            }
            else {
                const { category, ...others } = req.body
                const ifSubs = await Subcategory.findAll({
                    where: {
                        category_id: req.categoryId
                    }
                })
                log.debug('', ifSubs)
                if (ifSubs.length != 0) {
                    return res.status(400).send({ "error": 400, "message": "cannot add to categories having subcategories" })
                }
                log.debug('get category id', req.categoryId)
                const newProduct = await Product.create({ ...others, image: req.file.path, category_id: req.categoryId })
                log.info('Outgoin response from createProduct', { "respone": newProduct.dataValues })
                res.status(201).send({ "success": 201, "message": "Product added successfully by admin", "data": newProduct.dataValues })
            }
        }

        
    catch (err) {
        log.error('Error accesssing createProduct', { "error": err })
        if (err.errors) {
            res.status(400).send({ "error": 400, "message": err.errors[0].message })
        }
        else {
            res.status(400).send({ "error": 400, "message": err.message })

        }

    }

}

const editProduct = async (req, res) => {
    try {
        log.info('Incoming request to editProduct', { "request": req.body })
        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        if (req.body) {
            if (req.body.subcategory) {
                const index = updateKeys.findIndex(e => e === 'subcategory')
                updateKeys.splice(index, 1, 'subcategory_id')
                req.body['subcategory_id'] = req.subcategoryId
            }
            if (req.body.category) {
                const index = updateKeys.findIndex(e => e === 'category')
                updateKeys.splice(index, 1, 'category_id')
                if(req.body.subcategory == null ) {
                    const ifSubs = await Subcategory.findAll({
                        where: {
                            category_id: req.categoryId
                        }
                    })
                    log.debug('', ifSubs)
                    if (ifSubs.length != 0) {
                        return res.status(400).send({ "error": 400, "message": "cannot add to categories having subcategories" })
                    }
                }
                req.body['category_id'] = req.categoryId
            }

            const updateKeys = Object.keys(req.body)
            updateKeys.forEach(e => {
                if (req.body[e]) {
                    if (e == "price" || e == "quantity") {
                        product[e] = parseInt(req.body[e])
                    }
                    else {
                        product[e] = req.body[e]

                    }
                }
            })

        }

        if (req.file) {
            const { id, createdAt, updatedAt, image, ...others } = product.dataValues;
            fs.unlinkSync(image)
            console.log(others);
            const updatedProduct = await Product.update({image: req.file.path, ...others}, {
                where: {
                    id: req.params.id
                }
            })
            console.log(updatedProduct);
            const editedProduct = await Product.findOne({
                where: {
                    id: req.params.id
                }
            })
            log.info('Outgoin response from editProduct where subcategory exist', { "respone": editedProduct.dataValues })
            res.status(200).send({ "success": 200, "message": "Product edited successfully by admin", "data": editedProduct.dataValues })
        }
        else {
            const { id, createdAt, updatedAt, ...others } = product.dataValues;
            const updatedProduct = await Product.update(others, {
                where: {
                    id: req.params.id
                }
            })
            const editedProduct = await Product.findOne({
                where: {
                    id: req.params.id
                }
            })
            log.info('Outgoin response from editProduct where subcategory exist', { "respone": editedProduct.dataValues })
            res.status(200).send({ "success": 200, "message": "Product edited successfully by admin", "data": editedProduct.dataValues })
        }
    }
    catch (err) {
        log.error('Error accesssing editProduct', { "error": 'id doesnt exist' })
        if (err.errors) {
            res.status(400).send({ "error": 400, "message": err.errors[0].message })
        }
        else {
            res.status(400).send({ "error": 400, "message": 'id doesnt exist' })

        }

    }
}

const removeProduct = async (req, res) => {
    try {
        log.info('Incoming request to deleteProduct')
        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        })
        const removeProduct = await Product.destroy({
            where: {
                id: req.params.id
            }
        })
        if (removeProduct == 0) {
            return res.status(400).send({ "error": 400, "message": 'id doesnt exist' })
        }
        if (product.image != null) {
            fs.unlinkSync(product.image)

        }
        log.info('Outgoin response from deleteProduct', { "respone": "Product deleted successfully by admin" })

        res.status(200).send({ "success": 200, "message": "Product deleted successfully by admin" })
    }
    catch (err) {
        log.error('Error accesssing deleteProduct', { "error": err.message })
        res.status(400).send({ "error": 400, "message": err.message })

    }
}

const getProducts = async (req, res) => {
    try {
        log.info('Incoming request to getProducts')
        if(req.query.id) {
            const product = await Product.findOne({
                where: {
                    id: parseInt(req.query.id)
                }
            })
            log.info('Outgoin response from getProducts', { "respone": product.dataValues })
    
            res.status(200).send({ "success": 200, "message": "Product detail", "data": product.dataValues })
        }
        else {
            if (req.query.category) {
                const productsUnderCategories = await Product.findAll({
                    where: {
                        category_id: req.categoryId,
                        [Op.or]: [
                            { name: {
                                [Op.substring]: req.query.search ? req.query.search : ''
        
                            }
                        },
                        {
                            '$Subcategory.name$': {
                                [Op.substring]: req.query.search ? req.query.search : ''
        
                            }
                        }
                    ]
                    },
                    include: {
                        model: Subcategory,
                        attributes: []
    
                    },
                    limit: parseInt(req.query.range) || null,
                    offset: parseInt(req.query.range) * req.query.page || null,
                    order: req.query.property ? [[`${req.query.property}`, `${req.query.sort}`]] : [['createdAt', 'DESC' ]]
                })
                log.info('Outgoin response from getProducts', { "respone": productsUnderCategories })
    
                res.status(200).send({ "success": 200, "message": "List of products under a category", "data": productsUnderCategories })
            }
            if (req.query.subcategory) {
                const productsUnderSubcategories = await Product.findAll({
                    where: {
                        subcategory_id: req.subcategoryId,
                        name: {
                            [Op.substring]: req.query.search ? req.query.search : ''
                        }
                    },
                    limit: parseInt(req.query.range) || null,
                    offset: parseInt(req.query.range) * req.query.page || null,
                    order: req.query.property ? [[`${req.query.property}`, `${req.query.sort}`]] : [['createdAt', 'DESC' ]]
    
    
                })
                log.info('Outgoin response from getProducts', { "respone": productsUnderSubcategories })
    
                res.status(200).send({ "success": 200, "message": "List of products under a subcategory", "data": productsUnderSubcategories })
            }
            else {
                const allProducts = await Product.findAll({
                    where: {
                        [Op.or]: [
                            { name: {
                                [Op.substring]: req.query.search ? req.query.search : ''
        
                            }
                        },
                        {
                            '$Category.name$': {
                                [Op.substring]: req.query.search ? req.query.search : ''
        
                            }
                        }, 
                        {
                            '$Subcategory.name$': {
                                [Op.substring]: req.query.search ? req.query.search : ''
        
                            }
                        }
                        ]
                       
    
                    },
                    include: [{
                        model: Category,
                        attributes: []
                    },
                    {
                        model: Subcategory,
                        attributes:[]
                    }
                ],
                    limit: parseInt(req.query.range) || null,
                    offset: parseInt(req.query.range) * req.query.page || null,
                    order: req.query.property ? [[`${req.query.property}`, `${req.query.sort}`]] : [['createdAt', 'DESC' ]]
    
    
    
                })
                log.info('Outgoin response from getProducts', { "respone": allProducts })
                res.status(200).send({ "success": 200, "message": "List of products", "data": allProducts })
    
            }
        }
        
    }
    catch (err) {
        log.error('Error accesssing getProducts', { "error": err })
        res.status(400).send({ "error": 400, "message": err.message })
    }
};



const productsHome = async (req, res) => {
    try {
        log.info('Incoming request to productsHome')
        const homeProducts = await Subcategory.findAll({
            limit: 4,
            include: {
                model: Product,
                limit: 10
            }
        })
        log.info('Outgoin response from productsHome', { "respone": homeProducts })
        res.status(200).send({ "success": 200, "message": "Home page content", "data": homeProducts })
    }
    catch (err) {
        log.error('Error accesssing productsHome', { "error": err })
        res.status(400).send({ "error": 400, "message": err.message })
    }
}

const countProducts = async(req,res) => {
    try {
        log.info('Incoming request to countProducts')
        const count = await Product.count({
            group: ['category_id','subcategory_id']
        })
        log.info('Outgoin response from countProducts', {"response": count})

        res.status(200).send({"success": 200, "message": "total number of products under each subcategories", "data": count})
    }
    catch(err) {
        log.error('Error accesssing countProducts', {"error": err})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }
    }
}

const trendingProducts = async(req,res) => {
    try{
        log.info('Incoming request to trendingProducts')
        const ranking = await ProductsCart.findAll({
            group: ['cart_id']
        })
        log.info('Outgoin response from trendingProducts', {"response": ranking})

        res.status(200).send({"success": 200, "message": "", "data": ranking})

    }
    catch(err) {
        log.error('Error accesssing trending Products', {"error": err})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        } 
    }
}

module.exports = { createProduct, editProduct, removeProduct, getProducts, productsHome, countProducts }

