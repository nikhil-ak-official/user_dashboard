const express = require('express')
const authenticateToken = require('../middleware/auth')
const authorized = require('../middleware/admin')
const getCategoryId = require('../middleware/getCategoryId')
const log = require('../logs/logger')

const {createProduct,editProduct,removeProduct,getProducts, productsHome,countProducts} = require('../services/productServices')
const router = express.Router()


const multer = require('multer')
const path = require('path')
const sharp = require('sharp')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './images')
    },
    
    filename: function(req,file,cb){
        cb(null, Date.now()+file.originalname.replace('/\s+/g',''))
    }
})

const upload = multer({storage: storage,
fileFilter(req, file, cb){
    const ext = file.mimetype.split('/')[1]
    if(ext == "jpeg"|| ext == "png" || ext == "jpg") {
        return cb(null,true)
    }
    cb('Please upload an image file', null)
    
},
limits: {
    fileSize: 5000000
}
}).single('avatar')


// create product by admin
router.post('/create', authenticateToken, authorized(['admin']), function(req,res,next) {
    
    upload(req, res, function(err) {
  
        if(err instanceof multer.MulterError) {
            return res.status(400).send({"error":400, "message":err.message})
        }
        else if(err) {
            return res.status(400).send({"error":400, "message":err})

        }
    
        else if(!req.file) {
            return res.status(400).send({"error":400, "message": "please upload file"})
        }

        else {
            log.info('Outgoing response from multer middleware')

            next()
        }
    }
    )},
    getCategoryId, createProduct)

// edit product by admin
router.patch('/:id', authenticateToken, authorized(['admin']), function(req,res,next) {
    
    upload(req, res, function(err) {
        if(err instanceof multer.MulterError) {
            res.status(400).send({"error":400, "message":err.message})
        }
        else if(err) {
            res.status(400).send({"error":400, "message":err})

        }
        else {
            log.info('Outgoing response from multer middleware')
            next()
        }
    }
    )}, getCategoryId ,editProduct)

// delete product
router.delete('/:id', authenticateToken, authorized(['admin']), removeProduct)

router.get('/', authenticateToken, authorized(['admin', 'user']), getCategoryId,getProducts)

router.get('/home', authenticateToken, authorized(['admin', 'user']),productsHome)

router.get('/count', authenticateToken, authorized(['admin']), countProducts)



module.exports = router
