const express = require('express')
const Role = require('../models/role')
const User = require('../models/user')

// to get role id from role

const getRoleId = async (req, res, next) => {
    try {
        if (req.body.role && !req.params.id) {
            const roleId = await Role.findOne({
                attributes: ['id'],
                where: {
                    name: req.body.role
                }
            })
            req.roleId = roleId.id
            next()
        }
        else {
            if(req.params.id) {
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
                next()
            }
            else {
                next()
            }
           
        }

    }
    catch (err) {
        res.status(400).send("user with that id doesnt exist or user with role doesnt exist")
    }
}

module.exports = getRoleId