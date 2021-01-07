const express = require('express')


const authorized = (roles) => {
    return function (req, res, next) {
        if (req.query.action == null && req.url == "/password") {
            next()
        }
        else {
            if (req.query.action == "setPassword") {
                roles.filter(e => e != "admin")
            }
            const roleName = req.role
            if (roles.includes(roleName)) {
                next()
            }
            else {
                res.status(403).send("unauthorized role")
            }
        }


    }

}

module.exports = authorized