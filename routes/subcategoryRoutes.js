const express = require('express')
const authenticateToken = require('../middleware/auth')
const Role = require('../models/role')
const User = require('../models/user')
const Subcategory = require('..//models/subcategory')
const authorized = require('../middleware/admin')
const log = require('../logs/logger')
const Category = require('../models/category')
const Product = require('../models/product')

const router = express.Router()

// create subcategory by admin
router.post('/create', authenticateToken, authorized(['admin']) ,async (req,res) => {
    try {
        log.info('Incoming request to createSubcategory', {"request": req.body})
        const categoryId = await Category.findOne({
            where: {
                name: req.body.category
            }
        })
        const newSubcategory = await Subcategory.create({
            name: req.body.name,
            category_id: categoryId.id,
        })
        log.info('Outgoin response from createSubcategory', {"response": newSubcategory.dataValues})
        res.status(200).send({"success": 200, "message": "Subcategory added successfully by admin", "data": newSubcategory.dataValues})
    }
    catch(err) {
        log.error('Error accesssing createCategory', {"error": err.error[0].message})
        res.status(400).send({"error": 400, "message": err.error[0].message})
    }

})

// edit subcategory by admin
router.put('/:id', authenticateToken, authorized(['admin']) ,async (req,res) => {
    try {
        log.info('Incoming request to editSubcategory', {"request": req.body})
        const {category, name} = req.body
        const categoryId = await Category.findOne({
            where: {
                name: category
            }
        })
        const updateSubcategory = await Subcategory.update({category_id:categoryId.id, name:name}, {
            where: {
                id: req.params.id
            },
            individualHooks: true
        })
        log.info('Outgoin response from editSubcategory', {"response": updateSubcategory[1][0].dataValues})

        res.status(200).send({"success": 200, "message": "Subcategory edited successfully by admin", "data": updateSubcategory[1][0].dataValues})
    }
    catch(err) {
        log.error('Error accesssing editSubcategory', {"error": err.error[0].message})
        res.status(400).send({"error": 400, "message": err.error[0].message})
    }

})

// delete subcategory by admin
router.delete('/:id', authenticateToken, authorized(['admin']), async() => {
    try {
        log.info('Incoming request to deleteSubcategory')
        const removeSubcategory = await Subcategory.destroy({
            where: {
                id: req.params.id
            }
        })
        const removeAllProducts = await Product.destroy({
            where: {
                subcategory_id: req.params.id
            }
        })
        log.info('Outgoin response from deleteSubcategory', {"response": "Subcategory and products under it deleted successfully by admin"})

        res.status(200).send({"success": 200, "message": "Subcategory and products under it deleted successfully by admin"})
    }
    catch(err) {
        log.error('Error accesssing deleteSubcategory', {"error": err.error[0].message})
        res.status(400).send({"error": 400, "message": err.error[0].message})
    }
})