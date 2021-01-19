const express = require('express')
const jwt = require('jsonwebtoken')
const Role = require('../models/role')
const User = require('../models/user')
const log = require('../logs/logger')


const authenticateToken = async (req, res, next) => {
    try {
        if (req.query.action == null && req.url == "/password") {
            log.info('Incoming request to auth by create password without token')

            next()
        }
        else {
            let decode;
            let token
            if (req.query.action == "setPassword" || req.query.action == "resetPassword" || req.query.action =="login") {
                log.info('Incoming request to auth by set password, reset password or login', {"request": req.query.action})

                token = req.query.token
                decode = jwt.verify(token, process.env.RESET_TOKEN_SECRET_KEY)
            }
            else {
                log.info('Incoming request to auth')
                token = req.headers['authorization'].split(' ')[1]
                decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
            }

            const currentUser = await User.findOne({
                where: {
                    id: decode.id
                }
            })
            const currentUserRole = await Role.findOne({
                attributes: ['name'],
                where: {
                    id: decode.role_id
                }
            })
        
            if (token == currentUser.dataValues.token || token == currentUser.dataValues.resetPasswordToken) {
                req.role = currentUserRole.dataValues.name
                req.user = currentUser.dataValues
                req.token = token
                log.info('Outgoing response from auth', {"response": req.user})
                next()
            }
            else {
                log.error('Error response from auth', {"error": "expired token"})

                res.status(401).send({"error": 401, "message" :"expired token"})
            }

        }

    }
    catch (err) {
        log.error('Error accessing auth', {"error": err})

        res.status(401).send({"error": 401, "message" :err.message})
    }

}


module.exports = authenticateToken