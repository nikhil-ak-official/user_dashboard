const express = require('express')
const Logger = require('bunyan')


const getCachedData = async(req,res,next) => {
    try{
        log.info('Incoming request to getCachedData', { "request": key })
        const response = await getAsync('key')
        if(response == null) {
            next()
        }
        else {
            log.info('Outcoming response from getCachedData', {"response": response})

            res.status(200).send({ "success": 200, "message": "cache hit", "data": response})
        }
    }
    catch(err){
        log.error('Error accesssing getCachedData', { "error": err })
        res.status(400).send({ "error": 400, "message": err.message })
    }

}

module.exports = getCachedData