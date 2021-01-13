const express = require('express')
const authenticateToken = require('../middleware/auth')
const Role = require('../models/role')
const User = require('../models/user')
const Category = require('..//models/category')
const authorized = require('../middleware/admin')
const log = require('../logs/logger')
const Product = require('../models/product')

const router = express.Router()

// create product by admin
router.post('/create', authenticateToken, authorized(['admin']) ,async (req,res) => {
    try {
        log.info('Incoming request to createProduct', {"request": req.body})
        const {category, subcategory, ...others} = req.body
        const categoryId = await Category.findOne({
            where: {
                name: category
            }
        })
        const subcategoryId = await Subcategory.findOne({
            where: {
                name: subcategory
            }
        })
        const newProduct = await Product.create({category_id: categoryId.id, subcategory: subcategoryId.id, others})
        log.info('Outgoin response from createProduct', {"respone": newProduct.dataValues})
        res.status(200).send({"success": 200, "message": "Product added successfully by admin", "data": newProduct.dataValues})
    }
    catch(err) {
        log.error('Error accesssing createProduct', {"error": err.error[0].message})
        res.status(400).send({"error": 400, "message": err.error[0].message})
    }

})

// edit product by admin
router.put('/:id', authenticateToken, authorized(['admin']) ,async (req,res) => {
    try {
        log.info('Incoming request to editProduct', {"request": req.body})
        const {category, subcategory, ...others} = req.body
        const categoryId = await Category.findOne({
            where: {
                name: category
            }
        })
        const subcategoryId = await Subcategory.findOne({
            where: {
                name: subcategory
            }
        })
        const updateProduct = await Product.update({category_id: categoryId.id,subcategory_id: subcategoryId.id, ...others}, {
            where: {
                id: req.params.id
            },
            individualHooks: true
        })
        log.info('Outgoin response from editProduct', {"respone": updateProduct[1][0].dataValues})

        res.status(200).send({"success": 200, "message": "Product edited successfully by admin", "data": updateProduct[1][0].dataValues})
    }
    catch(err) {
        log.error('Error accesssing editProduct', {"error": err.error[0].message})
        res.status(400).send({"error": 400, "message": err.error[0].message})
    }

})

// delete product
router.delete('/:id', authenticateToken, authorized(['admin']), async() => {
    try {
        log.info('Incoming request to deleteProduct')
        const removeProduct = await Product.destroy({
            where: {
                id: req.params.id
            }
        })
        log.info('Outgoin response from deleteProduct', {"respone": "Product deleted successfully by admin"})

        res.status(200).send({"success": 200, "message": "Product deleted successfully by admin"})
    }
    catch(err) {
        log.error('Error accesssing deleteProduct', {"error": err.error[0].message})
        res.status(400).send({"error": 400, "message": err.error[0].message})
    }
})