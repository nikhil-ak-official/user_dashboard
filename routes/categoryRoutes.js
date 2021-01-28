const express = require('express')
const authenticateToken = require('../middleware/auth')
const authorized = require('../middleware/admin')
const {createCategory,editCategory,deleteCategory,countCategory} = require('../services/categoryServices')


const router = express.Router()

// create category by admin
router.post('/create', authenticateToken, authorized(['admin']) ,createCategory)

// edit category by admin
router.put('/:id', authenticateToken, authorized(['admin']) ,editCategory)

// delete category by admin
router.delete('/:id', authenticateToken, authorized(['admin']),deleteCategory );

// count categories
router.get('/count', authenticateToken, authorized(['admin']), countCategory)

module.exports = router