const express = require('express')
const Role = require('../models/role')
const User = require('../models/user')
const log = require('../logs/logger')


// to get role id from role

const getRoleId = async (req, res, next) => {
    try {
        if (req.body.role && !req.params.id) {
            log.info('Incoming request to getRoleId with role and no id params')

            const roleId = await Role.findOne({
                attributes: ['id'],
                where: {
                    name: req.body.role
                }
            })
            req.roleId = roleId.id
            log.info('Outgoing response from getRoleId with role and no id params', {"response": req.roleId})

            next()
        }
        else {
            if(req.params.id) {
                log.info('Incoming request to getRoleId with id params')
                const isAdmin = await User.findOne({
                    attributes: ['role_id'],
                    where: {
                        id: req.params.id
                    },
                    include: {
                        model: Role
                    }
                })
                req.editUserRole = isAdmin.Role.name 
                req.roleId = isAdmin.Role.id
                log.info('Outgoing response from getRoleId with id params', {"response": req.roleId})

                next()
            }
            else {
                log.info('Outgoing response from getRoleId')


                next()
            }
           
        }

    }
    catch (err) {
        log.error('Error accessing getRoleId ', {"response": "user with that id doesnt exist or user with role doesnt exist"})

        res.status(400).send({"error": 403, "message": "user with that id doesnt exist or user with role doesnt exist"})
    }
}

module.exports = getRoleId