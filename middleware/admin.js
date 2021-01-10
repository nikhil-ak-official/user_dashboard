const express = require('express')


const authorized = (roles) => {
    return function (req, res, next) {
        if (req.user.status == "inactive") {
            res.status(403).send("user inactive")
        }
        else {
            if (req.query.action == "setPassword") {
                roles.filter(e => e != "admin")
                console.log("hello");
            }
            const roleName = req.role
            if (roles.includes(roleName)) {
                console.log("hello2");
                console.log(roleName);
                console.log(roles);
                next()
            }
            else {
                res.status(403).send("unauthorized role")
            }
        }


    }

}

module.exports = authorized