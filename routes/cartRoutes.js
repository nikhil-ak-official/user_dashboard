const express = require('express')
const authenticateToken = require('../middleware/auth')
const authorized = require('../middleware/admin')
const {addToCart, removeFromCart, editFromCart, getAllFromCart, recommendedProducts} = require('../services/cartServices')

const { Sequelize } = require('sequelize')

const router = express.Router()

// add products to cart
router.post('/add', authenticateToken, authorized(['user']), addToCart)

router.delete('/:id?', authenticateToken, authorized(['user']), removeFromCart)

// edit product in cart

router.put('/:id', authenticateToken, authorized(['user']), editFromCart)

// get products in cart
router.get('/', authenticateToken, authorized(['user']), getAllFromCart)

// recommended products
router.get('/recommended', authenticateToken, authorized(['admin']), recommendedProducts)

// trending products
router.get('/trending', authenticateToken, authorized(['admin']), trendingProducts)




module.exports = router