
const Category = require('..//models/category')
const log = require('../logs/logger')


const createCategory = async (req,res) => {
    try {
        log.info('Incoming request to createCategory', {"request": req.body})
        const newCategory = await Category.create(req.body)
        log.info('Outgoin response from createCategory', {"response": newCategory.dataValues})
        res.status(201).send({"success": 201, "message": "Category added successfully by admin", "data": newCategory.dataValues})
    }
    catch(err) {
        log.error('Error accesssing createCategory', {"error": err.message})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }
    }

}

const editCategory = async (req,res) => {
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
        log.error('Error accesssing editCategory', {"error": 'id doesnt exist'})
        if(err.errors) {
            return res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        if(err.message == "category name already exist") {
            return res.status(400).send({ "error": 400, "message": err.message })

        }
        return res.status(400).send({ "error": 400, "message": "id doesnt exist" })
        
    }

}

const deleteCategory = async(req,res) => {
    try {
        log.info('Incoming request to deleteCategory')
        const removeCategory = await Category.destroy({
            where: {
                id: req.params.id
            }
        })
        if(removeCategory == 0) {
            return res.status(400).send({"error": 400, "message": 'id doesnt exist' })
        }
        log.info('Outgoin response from deleteCategory', {"response": "Category and all subcategories under it deleted successfully by admin"})

        res.status(200).send({"success": 200, "message": "Categoryand all subcategories under it deleted successfully by admin"})
    }
    catch(err) {
        log.error('Error accesssing deleteCategory', {"error": err})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }
    }
}

const countCategory = async(req,res) => {
    try {
        log.info('Incoming request to countCategory')
        const count = await Category.count()
        log.info('Outgoin response from countCategory', {"response": count})

        res.status(200).send({"success": 200, "message": "total number of categories", "data": count})
    }
    catch(err) {
        log.error('Error accesssing countCategory', {"error": err})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }
    }
}


module.exports = {createCategory,editCategory,deleteCategory, countCategory}