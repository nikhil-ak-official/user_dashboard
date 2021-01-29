const Category = require('..//models/category')
const Subcategory = require('../models/subcategory')
const log = require('../logs/logger')
const Product = require('../models/product')
const Cart = require('../models/cart')
const ProductsCart = require('../models/productscart')
const { Sequelize } = require('sequelize')



const addToCart = async(req,res) => {
    try{
        log.info('Incoming request to addtocart', {"request": req.body})
        const getProductDetails = await Product.findOne({
            where: {
                name: req.body.productName
            }
        })
        if(getProductDetails) {
            if(getProductDetails.quantity < req.body.productQuantity) {
                return res.status(400).send({"error": 400, "message": "quantity should be less than available quantity"})
            }
            const cartId = await Cart.findAll(
                {
                    where: {
                        user_id: req.user.id
                    }
                }
            )
            let mapToProduct
            if(cartId.length == 0) {
                const addCart = await Cart.create({user_id: req.user.id})
                mapToProduct = await ProductsCart.create({
                    product_id: getProductDetails.id,
                    cart_id: addCart.dataValues.id,
                    product_quantity: req.body.productQuantity
                })

            }
            else {
                const updateCart = await Cart.update({
                    updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
                }, {
                    where: {
                        user_id: req.user.id
                    },
                    individualHooks: true
                })
                mapToProduct = await ProductsCart.create({
                    product_id: getProductDetails.id,
                    cart_id: updateCart[1][0].dataValues.id,
                    product_quantity: req.body.productQuantity
                })
            }
           
            log.info('Outgoin response from addtocart', {"response": mapToProduct.dataValues})
            res.status(201).send({"success": 201, "message": "Added product to cart successfully", "data": mapToProduct.dataValues})
        } 
        else {
            log.error('Error response from addtocart', {"error": req.categoryId})
            res.status(400).send({"error": 400, "message": "product doesnt exist"})
        }
    }
    catch(err){
        log.error('Error accesssing add to cart', {"error":  err.message})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }
    }

}

const removeFromCart = async(req,res)=> {
    try{
        log.info('Incoming request to removefromcart')

        const cartId = await Cart.findOne({
            where: {
                user_id:req.user.id
            }
        })
        if(req.params.id) {
            
            const removeProduct = await ProductsCart.destroy({
                where: {
                    product_id: req.params.id,
                    cart_id: cartId.id
                }
            })
            log.info('Outgoin response from removefromcart', {"response": "Product removed from cart successfully"})
            res.status(200).send({"success": 200, "message": "Product removed from cart successfully"})

        }
        else {
            const removeProduct = await ProductsCart.destroy({
                where: {
                    cart_id: cartId.id
                }
            })
            log.info('Outgoin response from removefromcart', {"response":"All products removed from cart successfully"})
            res.status(200).send({"success": 200, "message": "All products removed from cart successfully"})
        }

    }
    catch(err) {
        log.error('Error accesssing removefromcart', {"error":  err.message})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        } 
    }
}

const editFromCart = async(req,res) => {
    try{
        log.info('Incoming request to editCart', {"request": req.body})
        const cartId = await Cart.findOne({
            where: {
                user_id: req.user.id
            }
        })
        const updateQuantity = await ProductsCart.update({
            product_quantity: req.body.quantity
        },{
            where: {
               cart_id: cartId.id,
               product_id: req.params.id
            },
            individualHooks: true
        })
        log.info('Outgoin response from editcart', {"response": updateQuantity[1][0].dataValues})
        res.status(200).send({"success": 200, "message": "Edited product in cart successfully", "data": updateQuantity[1][0].dataValues})

    }
    catch(err){
        log.error('Error accesssing editfromcart', {"error":  err.message})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        } 
    }
}

const getAllFromCart = async(req,res) => {
    try{
        log.info('Incoming request to getAllFromCart')

        const allCart = await Cart.findAll({
            where: {
                user_id: req.user.id
            },
            include: {
                model: Product,
                through: {
                    attributes: ['product_quantity']
                }
                
            }
        })

        log.info('Outgoin response from getAllFromCart', {"response": allCart})
        res.status(200).send({"success": 200, "message": "List all products from cart successfully", "data": allCart})

    }
    catch(err){
        log.error('Error accesssing getAllFromCart', {"error":  err.message})
        res.status(400).send({"error": 400, "message": err.message })
    }
}

const recommendedProducts = async(req,res) => {
    try {
        log.info('Incoming request to recommendedProducts')
        const allCart = await Cart.findAll({
            attributes: ['id', 'user_id'],            
            include: {
                model: Product,
                attributes: ['id', 'name', 'category_id',
            [Sequelize.literal('(RANK() OVER (ORDER BY Products.category_id DESC))'), 'rank']],

                through: {
                    attributes: ['product_quantity']
                }
                
            }
        })
    
        log.info('Outgoin response from recommendedProducts', {"response": allCart})
        res.status(200).send({"success": 200, "message": "recommended products", "data": allCart})
    }
    catch(err){
    log.error('Error accesssing recommendedProductsProducts', {"error":  err.message})
    res.status(400).send({"error": 400, "message": err.message })
    }
}

const trendingProducts = async(req,res) => {
    try {
        log.info('Incoming request to recommendedProducts')
        const allCart = await Cart.findAll({
            attributes: ['id', 'user_id'],            
            include: {
                model: Product,
                attributes: ['id', 'name', 'category_id',
            [Sequelize.literal('(RANK() OVER (ORDER BY Products.category_id DESC))'), 'rank']],

                through: {
                    attributes: ['product_quantity']
                }
                
            }
        })
    
        log.info('Outgoin response from recommendedProducts', {"response": allCart})
        res.status(200).send({"success": 200, "message": "recommended products", "data": allCart})
    }
    catch(err){
    log.error('Error accesssing recommendedProductsProducts', {"error":  err.message})
    res.status(400).send({"error": 400, "message": err.message })
    }
}

module.exports = {addToCart, removeFromCart, editFromCart, getAllFromCart, recommendedProducts, trendingProducts}