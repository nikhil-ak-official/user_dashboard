
const express = require('express')
const log = require('../logs/logger')

const {del} = require('../db/redisCache')
const { RedisError } = require('redis')


const clearCache = async(key) => {
    try {
        // log.info('Incoming request to clearCache', { "request": key })
        // if(url=='/:id') {
        //     const categoryId = data.category_id
        //     const subcategoryId = data.id
        //     const oldData = JSON.parse(await getAsync(key))
        //     let subIndex
        //     const delIndex = oldData.findIndex(e => e.Subcategories.forEach(
        //         (e, index) => {if(e.id == subcategoryId) {
        //             subIndex = index
        //         }}
        //         ))
        //         console.log(delIndex);
        //         console.log(subIndex);
        //     oldData[delIndex].Subcategories.splice(subIndex, 1)
        //     const addIndex = oldData.findIndex(e => e.id == categoryId)
        //     oldData[addIndex].Subcategories.unshift(data)
        //     await setAsync(key,JSON.stringify(oldData))
        //     log.info('Outcoming response from clearCache', {"response": "added new data to cached key"})
        // }
        // if(url=='/create') {
        //     const categoryId = data.category_id
        //     const oldData = JSON.parse(await getAsync(key))
        //     const index = oldData.findIndex(e => e.id == categoryId)
        //     oldData[index].Subcategories.unshift(data)
        //     await setAsync(key,JSON.stringify(oldData))
        //     log.info('Outcoming response from clearCache', {"response": "added new data to cached key"})

        // }
        log.info('Incoming request to clearCache', { "request": key})
        await del(key)
        log.info('Outcoming response from clearCache', {"response": "deleted cached key"})
        return true

    }
    catch(err){
        if(err instanceof RedisError) {
            return res.status(400).send({ "error": 400, "message": err.message })
        }
        log.error('Error accesssing clear cache', { "error": err })
        res.status(400).send({ "error": 400, "message": err.message })
    }

}
module.exports = clearCache