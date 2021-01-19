const express = require('express')
const log = require('../logs/logger')


const authorized = (roles) => {
    return function (req, res, next) {
        if (req.user.status == "inactive") {
            log.info('Incoming request to authorized by inactive')

            res.status(403).send({"error": 403, "message": "user inactive"})
        }
        else {
            if (req.query.action == "setPassword" || req.url == "/password") {
                log.info('Incoming request to authorized for create password')

                roles.filter(e => e != "admin")
               
            }
            const roleName = req.role
            if (roles.includes(roleName)) {
                log.info('Outgoin response from authorized', {"response": roleName})
                
                next()
            }
            else {
                log.error('Error response from authorized', {"error": "unauthorized role"})

                res.status(403).send({"error": 403, "message": "unauthorized role"})
            }
        }


    }

}

module.exports = authorized