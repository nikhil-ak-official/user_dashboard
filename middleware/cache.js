const express = require('express')
const {getAsync} = require('../db/redisCache')

const log = require('../logs/logger')


const getCachedData = async(req,res,next) => {
    try{
        log.info('Incoming request to getCachedData')
        const response = await getAsync('subcategoriesKey')

        if(response == null)  {
            next()
        }
        else {

            log.info('Outcoming response from getCachedData', {"response": response})

            res.status(200).send({ "success": 200, "message": "cache hit", "data": JSON.parse(response)})
        }
    }
    catch(err){
        if(err instanceof RedisError) {
            return res.status(400).send({ "error": 400, "message": err.message })
        }
        log.error('Error accesssing getCachedData', { "error": err })
        res.status(400).send({ "error": 400, "message": err.message })
    }

}

module.exports = getCachedData