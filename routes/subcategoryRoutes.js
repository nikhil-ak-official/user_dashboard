const express = require('express')
const authenticateToken = require('../middleware/auth')
const Role = require('../models/role')
const User = require('../models/user')
const Subcategory = require('..//models/subcategory')
const authorized = require('../middleware/admin')
const log = require('../logs/logger')
const Category = require('../models/category')
const getCategoryId = require('../middleware/getCategoryId')
const { ERROR } = require('bunyan')

const router = express.Router()

// create subcategory by admin
router.post('/create', authenticateToken, authorized(['admin']) , getCategoryId, async (req,res) => {
    try {
        log.info('Incoming request to createSubcategory', {"request": req.body})
        const newSubcategory = await Subcategory.create({
            name: req.body.name,
            category_id: req.categoryId,
        })
        log.info('Outgoin response from createSubcategory', {"response": req.categoryId})
        res.status(201).send({"success": 201, "message": "Subcategory added successfully by admin", "data": newSubcategory.dataValues})
    }
    catch(err) {
        log.error('Error accesssing subcategory', {"error":  err.message})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }
    }

})

// edit subcategory by admin
router.put('/:id', authenticateToken, authorized(['admin']), getCategoryId ,async (req,res) => {
    try {
        log.info('Incoming request to editSubcategory', {"request": req.body})
        const {category, name} = req.body
        const updateSubcategory = await Subcategory.update({ name:name, category_id: req.categoryId,}, {
            where: {
                id: req.params.id
            },
            individualHooks: true
        })

        log.info('Outgoin response from editSubcategory', {"response": updateSubcategory[1][0].dataValues})

        res.status(200).send({"success": 200, "message": "Subcategory edited successfully by admin", "data": updateSubcategory[1][0].dataValues})
    }
    catch(err) {
        log.error('Error accesssing editSubcategory', {"error": err.message})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": 'id doesnt exist' })

        }}

})

// delete subcategory by admin
router.delete('/:id', authenticateToken, authorized(['admin']), async(req,res) => {
    try {
        log.info('Incoming request to deleteSubcategory')
        const removeSubcategory = await Subcategory.destroy({
            where: {
                id: req.params.id
            }
        })  
        if(removeSubcategory == 0) {
            return res.status(400).send({"error": 400, "message": 'id doesnt exist' })
        }      
        log.info('Outgoin response from deleteSubcategory', {"response": "Subcategory and products under it deleted successfully by admin"})

        res.status(200).send({"success": 200, "message": "Subcategory and products under it deleted successfully by admin"})
    }
    catch(err) {
        log.error('Error accesssing deleteSubcategory', {"error": err})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }
    }
})


// get list of subcategories and categories
router.get('/', authenticateToken, authorized(['admin','user']),async(req,res) => {
    try{
        log.info('Incoming request to getListOfSubcategory')

        const listAll = await Category.findAll({
            include: {
                model: Subcategory
            }
        })
        log.info('Outgoin response from getListOfSubcategory', {"response": listAll.dataValues})

        res.status(200).send({"success": 200, "message": "list of subcategories under each categories listed successfully","data": listAll})
    }
    catch(err) {
        log.error('Error accessing getList', {"error": err.message})
        res.status(400).send({"error": 400, "message": err.message })
    }
})

module.exports = router
