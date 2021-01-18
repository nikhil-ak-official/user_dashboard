const express = require('express')
const authenticateToken = require('../middleware/auth')
const authorized = require('../middleware/admin')
const getCategoryId = require('../middleware/getCategoryId')
const {createProduct,editProduct,removeProduct,getProducts} = require('../services/productServices')
const router = express.Router()


const multer = require('multer')
const path = require('path')
const sharp = require('sharp')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './images')
    },
    
    filename: function(req,file,cb){
        cb(null, Date.now()+file.originalname)
    }
})

const upload = multer({storage: storage,
fileFilter(req, file, cb){
        if(!file) {
            return cb('Please select a file to upload', null)

    }
    const ext = file.mimetype.split('/')[1]
    if(ext == "jpeg"|| ext == "png" || ext == "jpg") {
        return cb(null,true)
    }
    cb('Please upload an image file', null)
    
},
limits: {
    fileSize: 1000000
}
}).single('avatar')


// create product by admin
router.post('/create', authenticateToken, authorized(['admin']), function(req,res,next) {
    
    upload(req, res, function(err) {
        if(!req.file) {
            res.status(400).send({"error":400, "message":'Please select a file to upload'})
            
        }
        if(err instanceof multer.MulterError) {
            res.status(400).send({"error":400, "message":err.message})
        }
        else if(err) {
            res.status(400).send({"error":400, "message":err})

        }
        else {
            next()
        }
    }
    )},
    getCategoryId, createProduct)

// edit product by admin
router.put('/:id', authenticateToken, authorized(['admin']), getCategoryId ,editProduct)

// delete product
router.delete('/:id', authenticateToken, authorized(['admin']), removeProduct)

router.get('/', authenticateToken, authorized(['admin', 'user']), getCategoryId,getProducts)

// router.post('/image/:id', function(req,res,next) {
    
//     upload(req, res, function(err) {
//         if(!req.file) {
//             res.status(400).send({"error":400, "message":'Please select a file to upload'})
            
//         }
//         if(err instanceof multer.MulterError) {
//             res.status(400).send({"error":400, "message":err.message})
//         }
//         else if(err) {
//             res.status(400).send({"error":400, "message":err})

//         }
//         else {
//             next()
//         }
//     }
//     )}, async(req,res) => {
//         const image = await Product.update({
//             image: req.file.path
//         }, {
//             where: {
//                 id: req.params.id
//             }
//         })
//         res.status(201).send(req.file)
// })


module.exports = router
