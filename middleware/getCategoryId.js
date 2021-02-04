const express = require('express')
const log = require('../logs/logger')
const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const fs = require('fs')


const getCategoryId = async(req,res,next) => {
    try{
        if(req.query.category || req.body.category) {
            const categoryId = await Category.findOne({
                where: {
                    name: req.query.category || req.body.category
                }
            })
            req.categoryId = categoryId.id
        }
        if(req.query.subcategory || req.body.subcategory){
            const subcategoryId = await Subcategory.findOne({
                where: {
                    name: req.query.subcategory || req.body.subcategory
                }
            })
            req.subcategoryId = subcategoryId.id
        }
        next()
    }
    catch(err) {
        log.error('Error response from getCategoryId', {"error": "unauthorized role"})
        fs.unlinkSync(req.file.path)
        res.status(404).send({"error":404, "message":"category or subcategory doesnt exist"})
    }
   
    
}

module.exports = getCategoryId