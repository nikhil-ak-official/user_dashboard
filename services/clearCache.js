
const express = require('express')
const Logger = require('bunyan')

const clearCache = async(key) => {
    try {
        log.info('Incoming request to clearCache', { "request": key })
        await del(key)
        log.info('Outcoming response from clearCache', {"response": "deleted cached key"})
    }
    catch(err){
        log.error('Error accesssing clear cache', { "error": err })
        res.status(400).send({ "error": 400, "message": err.message })
    }

}
module.exports = clearCache