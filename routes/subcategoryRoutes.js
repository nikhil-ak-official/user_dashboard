const express = require('express')
const authenticateToken = require('../middleware/auth')
const authorized = require('../middleware/admin')
const getCategoryId = require('../middleware/getCategoryId')
const getCachedData = require('../middleware/cache')


const {createSubcategory,editSubcategory,deleteSubcategory,listOfSubs,countSubcategory}= require('../services/SubcategoryServices')

const router = express.Router()

// create subcategory by admin
router.post('/create', authenticateToken, authorized(['admin']) , getCategoryId, createSubcategory)

// edit subcategory by admin
router.put('/:id', authenticateToken, authorized(['admin']), getCategoryId ,editSubcategory)

// delete subcategory by admin
router.delete('/:id', authenticateToken, authorized(['admin']),deleteSubcategory )


// get list of subcategories and categories
router.get('/', authenticateToken, authorized(['admin','user']), getCachedData,listOfSubs)

// count subcategories
router.get('/count', authenticateToken, authorized(['admin']), countSubcategory)

module.exports = router
