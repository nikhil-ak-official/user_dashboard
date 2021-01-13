const express = require('express')
const authenticateToken = require('../middleware/auth')
const Role = require('../models/role')
const User = require('../models/user')
const Category = require('..//models/category')
const authorized = require('../middleware/admin')
const log = require('../logs/logger')
const Subcategory = require('../models/subcategory')

const router = express.Router()

// create category by admin
router.post('/create', authenticateToken, authorized(['admin']) ,async (req,res) => {
    try {
        log.info('Incoming request to createCategory', {"request": req.body})
        const newCategory = await Category.create(req.body)
        log.info('Outgoin response from createCategory', {"response": newCategory.dataValues})
        res.status(200).send({"success": 200, "message": "Category added successfully by admin", "data": newCategory.dataValues})
    }
    catch(err) {
        log.error('Error accesssing createCategory', {"error": err.error[0].message})
        res.status(400).send({"error": 400, "message": err.error[0].message})
    }

})

// edit category by admin
router.put('/:id', authenticateToken, authorized(['admin']) ,async (req,res) => {
    try {
        log.info('Incoming request to editCategory', {"request": req.body})
        const updateCategory = await Category.update(req.body, {
            where: {
                id: req.params.id
            },
            individualHooks: true
        })
        log.info('Outgoin response from editCategory', {"response": updateCategory[1][0].dataValues})

        res.status(200).send({"success": 200, "message": "Category edited successfully by admin", "data": updateCategory[1][0].dataValues})
    }
    catch(err) {
        log.error('Error accesssing editCategory', {"error": err.error[0].message})
        res.status(400).send({"error": 400, "message": err.error[0].message})
    }

})

// delete category by admin
router.delete('/:id', authenticateToken, authorized(['admin']), async() => {
    try {
        log.info('Incoming request to deleteCategory')
        const removeCategory = await Category.destroy({
            where: {
                id: req.params.id
            }
        })
        const removeAllSubcategories = await Subcategory.destroy({
            where: {
                category_id: req.params.id
            }
        })
        log.info('Outgoin response from deleteCategory', {"response": "Category and all subcategories under it deleted successfully by admin"})

        res.status(200).send({"success": 200, "message": "Categoryand all subcategories under it deleted successfully by admin"})
    }
    catch(err) {
        log.error('Error accesssing deleteCategory', {"error": err.error[0].message})
        res.status(400).send({"error": 400, "message": err.error[0].message})
    }
})