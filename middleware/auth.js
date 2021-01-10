const express = require('express')
const jwt = require('jsonwebtoken')
const Role = require('../models/role')
const User = require('../models/user')

const authenticateToken = async (req, res, next) => {
    try {
        if (req.query.action == null && req.url == "/password") {
            next()
        }
        else {
            let decode;
            let token
            if (req.query.action == "setPassword" || req.query.action == "resetPassword" || req.query.action =="login") {
                token = req.query.token
                decode = jwt.verify(token, process.env.RESET_TOKEN_SECRET_KEY)
            }
            else {;
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
                next()
            }
            else {
                res.status(401).send("expired token")
            }

        }

    }
    catch (err) {

        res.status(401).send(err.message)
    }

}


module.exports = authenticateToken