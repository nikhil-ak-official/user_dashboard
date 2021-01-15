const express = require('express')
const authenticateToken = require('../middleware/auth')
const Role = require('../models/role')
const User = require('../models/user')
const Category = require('..//models/category')
const Subcategory = require('../models/subcategory')
const authorized = require('../middleware/admin')
const log = require('../logs/logger')
const Product = require('../models/product')
const getCategoryId = require('../middleware/getCategoryId')
var multer = require('multer')


const router = express.Router()

// create product by admin
router.post('/create', authenticateToken, authorized(['admin']), getCategoryId ,async (req,res) => {
    try {
        log.info('Incoming request to createProduct', {"request": req.body})
        if(req.body.subcategory) {
            const {category, subcategory, ...others} = req.body
            log.debug('get category id', req.categoryId)
            log.debug('get category id', req.subcategoryId)
            const newProduct = await Product.create({...others, category_id: req.categoryId, subcategory_id: req.subcategoryId})
            log.info('Outgoin response from createProduct', {"respone": newProduct.dataValues})
            res.status(201).send({"success": 201, "message": "Product added successfully by admin", "data": newProduct.dataValues})
        }
        else {
            const {category, subcategory, ...others} = req.body
            log.debug('get category id', req.categoryId)
            const newProduct = await Product.create({...others, category_id: req.categoryId})
            log.info('Outgoin response from createProduct', {"respone": newProduct.dataValues})
            res.status(201).send({"success": 201, "message": "Product added successfully by admin", "data": newProduct.dataValues})
        }
    }
    catch(err) {
        log.error('Error accesssing createProduct', {"error": err})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }

    }

})

// edit product by admin
router.put('/:id', authenticateToken, authorized(['admin']), getCategoryId ,async (req,res) => {
    try {
        log.info('Incoming request to editProduct', {"request": req.body})
        if(req.body.subcategory) {
            const {category, subcategory, ...others} = req.body
            const updateProduct = await Product.update({category_id: req.categoryId,subcategory_id: req.subcategoryId, ...others}, {
                where: {
                    id: req.params.id
                },
                individualHooks: true
            })
 
            log.info('Outgoin response from editProduct where subcategory exist', {"respone": updateProduct[1][0].dataValues})

            res.status(200).send({"success": 200, "message": "Product edited successfully by admin", "data": updateProduct[1][0].dataValues})
        }
        else {
            const {category, ...others} = req.body
        const updateProduct = await Product.update({category_id: req.categoryId, ...others}, {
            where: {
                id: req.params.id
            },
            individualHooks: true
        })
        log.info('Outgoin response from editProduct', {"respone": updateProduct[1][0].dataValues})

        res.status(200).send({"success": 200, "message": "Product edited successfully by admin", "data": updateProduct[1][0].dataValues})
        }
        
    }
    catch(err) {
        log.error('Error accesssing editProduct', {"error": 'id doesnt exist'})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": 'id doesnt exist' })

        }

    }

})

// delete product
router.delete('/:id', authenticateToken, authorized(['admin']), async(req,res) => {
    try {
        log.info('Incoming request to deleteProduct')
        const removeProduct = await Product.destroy({
            where: {
                id: req.params.id
            }
        })
        if(removeProduct == 0) {
            return res.status(400).send({"error": 400, "message": 'id doesnt exist' })
        }
        log.info('Outgoin response from deleteProduct', {"respone": "Product deleted successfully by admin"})

        res.status(200).send({"success": 200, "message": "Product deleted successfully by admin" })
    }
    catch(err) {
        log.error('Error accesssing deleteProduct', {"error": err.message})
        res.status(400).send({"error": 400, "message": err.message })

    }
})

router.get('/', authenticateToken, authorized(['admin', 'user']), getCategoryId, async(req,res) => {
    try{
        log.info('Incoming request to getProducts')
        if(req.query.category) {
            const productsUnderCategories = await Product.findAll({
                where: {
                    category_id: req.categoryId,
                },
                limit: parseInt(req.query.range) || null

            })
            log.info('Outgoin response from getProducts', {"respone": productsUnderCategories})
    
            res.status(200).send({"success": 200, "message": "List of products under a category", "data": productsUnderCategories})
        }
        if(req.query.subcategory) {
            const productsUnderSubcategories = await Product.findAll({
                where: {
                    subcategory_id: req.subcategoryId
                },
                limit: parseInt(req.query.range) || null
            })
            log.info('Outgoin response from getProducts', {"respone": productsUnderSubcategories})
    
            res.status(200).send({"success": 200, "message": "List of products under a subcategory", "data": productsUnderSubcategories})
        }
        else {
            const allProducts = await Product.findAll({
                limit: parseInt(req.query.range) || null

            })
            log.info('Outgoin response from getProducts', {"respone": allProducts})
            res.status(200).send({"success": 200, "message": "List of products", "data": allProducts})

        }
    }
    catch(err){
        log.error('Error accesssing getProducts', {"error": err})
        res.status(400).send({"error": 400, "message": err.message })
    }    


    
    
})


module.exports = router
