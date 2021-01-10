const express = require('express')
const Role = require('../models/role')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { welcomeEmail, forgotPasswordEmail } = require('../emails/email')



const getUsersList = async (req, res) => {
    try {
        const role = req.role
        if (role == "admin") {
            const usersList = await User.findAll({
                attributes: {
                    exclude: ['password', 'token', 'role_id', 'resetPasswordToken']
                },
                include: {
                    model: Role,
                    attributes: ['name']
                }
            })
            res.status(200).send({"success": 200, "message": "admin sees the list of users", "data" :usersList})
        }
        else {
            if (role == "user") {
                const userList = await User.findAll({
                    where: {
                        role_id: req.user.role_id
                    },
                    attributes: ['firstname', 'lastname', 'email', 'status']
                })
                res.status(200).send({"success": 200, "message": "user sees the list of users", "data" :userList})
            }
        }

    }
    catch (err) {
        res.status(400).send(err)
    }

}

const createUser = async (req, res) => {
    const { role, link, ...others } = req.body;
    try {
        const user = { ...others, role_id: req.roleId }
        const createUser = await User.create(user)
        // welcomeEmail(req.body.firstname, req.body.email, link + `?action=setPassword&token=${createUser.dataValues.resetPasswordToken}`)
        const newUser = createUser.dataValues
        res.status(201).send({"success": 201, "message": "admin creates users", "data" : {newUser, role}})
    }
    catch (err) {
        res.status(400).send(err)
    }

}

const createPassword = async (req, res) => {
    try {

        if (req.query.token) {
            const addPassword = await User.update({
                password: req.body.password
            }, {
                where: {
                    email: req.user.email
                },
                individualHooks: true
            })
            res.redirect(`/user/login?action=login&token=${req.token}`)
        }

        else {
            const addPassword = await User.update({
                password: req.body.password,
                token: null
            }, {
                where: {
                    email: req.body.email
                },
                individualHooks: true
            })
            res.status(200).send({"success": 200, "message": "user sets password", "data" : addPassword[1][0].dataValues})
            // res.redirect(`/user/login`)
        }

    }
    catch (err) {
        res.status(400).send(err)
    }
}

const checkUser = async (req, res) => {
    try {
        const checkEmail = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        if (checkEmail.status == "pending") {
            res.status(200).send({"success": 200, "message": "check if user exist and if new user", "data" : checkEmail.status})
        }
        else {
            if(checkEmail.status == "inactive") {
                res.status(403).send({"error": 403, "message": "user inactive"})
            }
            else {
                res.status(200).send({"success": 200, "message": "user exist"})
            }
        }
    }
    catch (err) {
        res.status(400).send({"error": 400, "message": "email doesnt exist"})
    }
}

const loginUser = async (req, res) => {
    try {
            const existUser = await User.findOne({
                where: {
                    email: req.body.email
                },
                include: {
                    model: Role,
                    attributes: ['name']
                }
            })
            if(existUser) {
                if (await bcrypt.compare(req.body.password, existUser.password)) {
                    if(existUser.status == "inactive") {
                        res.send(403).send({"error": 403, "message": "user inactive"})
                    }
                    else {
                        const token = await existUser.generateToken()
                        const changeStatus = await User.update({
                            status: "active",
                            token: token,
                            resetPasswordToken: null
                        }, {
                            where: {
                                email: req.body.email
                            },
                            individualHooks: true
                        })
                        const role = existUser.Role.name
                        const loggedUser = changeStatus[1][0].dataValues
                        res.status(200).send({"success": 200, "message": "user logged in successfully", "data":{loggedUser, role}})
                    }
                   
                }
                else {
                    res.status(401).send({"error": 401, "message": "password doesnt match"})
                }
            }
            
        else {
            res.status(401).send({"error": 400, "message": "please enter correct email"})
        }

    }
    catch (err) {
        res.status(400).send(err)
    }
}

const loginUserWithToken = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.user.email
            }
        })
        const token = await user.generateToken()
        const changeStatus = await User.update({
            status: "active",
            token,
            resetPasswordToken: null
        }, {
            where: {
                email: req.user.email
            },
            individualHooks: true
        })
        const role = req.role
        const loggedUser = changeStatus[1][0].dataValues
        res.status(200).send({"success": 200, "message": "user logged in successfully with token", "data":{loggedUser, role}})
    }
    catch (err) {
        res.status(400).send(err)
    }
}

const forgotPassword = async (req, res) => {
    try {
        if (req.body.link) {
            const user = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
            const action = "resetPassword"
            const resetToken = await user.generateToken(action)
            const updateResetToken = await User.update({
                resetPasswordToken: resetToken
            }, {
                where: {
                    email: user.email
                },
                individualHooks: true
            })
            // forgotPasswordEmail(updateResetToken[1][0].dataValues.firstname, updateResetToken[1][0].dataValues.email, req.body.link + `?action=${action}&token=${resetToken}`)
            res.status(200).send({"success": 200, "message":"mail sent"})
        }
        else {
            res.status(400).send({"error": 400, "message": "please provide the link to attach to the mail"})
        }
    }
    catch (err) {
        res.status(400).send(err)
    }

}

const changePassword = async (req, res) => {
    try {
        const oldPasswordCheck = await bcrypt.compare(req.body.oldPassword, req.user.password)
        if (oldPasswordCheck) {
            if (req.body.newPassword != req.body.oldPassword) {
                const changePassword = await User.update({
                    password: req.body.newPassword
                }, {
                    where: {
                        email: req.user.email
                    },
                    individualHooks: true
                })
                const role = req.role
                const changePasswordUser = changePassword[1][0].dataValues
                res.status(200).send({"success": 200, "message": "user changed password successfully", "data":{changePasswordUser, role}})
            }
            else {
                res.status(400).send({"error": 400, "message": "no change in password"})
            }
        }
        else {
            res.status(404).send({"error": 404, "message": "entered wrong old password"})
        }
    }
    catch (err) {
        res.status(400).send(err)
    }
}

const editUser = async (req, res) => {
    try {
        if ((req.role == "admin") && (req.params.id) && (req.params.id != req.user.id)) {
            if(req.editUserRole == "admin") {
                res.status(400).send({"error": 400, "message": "cannot edit admin details"})
            }
            else {
                let updates;
            if (req.body.role) {
                updates = Object.keys(req.body)
                const index = updates.findIndex(e => e === 'role')
                updates.splice(index, 1, 'role_id')
                req.body['role_id'] = req.roleId
            }
            else {
                updates = Object.keys(req.body)
            }
            const allowedUpdates = ['firstname', 'lastname', 'email', 'status', 'role_id']
            const validation = updates.every(e => { return allowedUpdates.includes(e) })
            if (!validation) {
                return res.status(400).send({"error": 400, "message": "please enter valid update keys"})
            }
            else {
                console.log("in edit");
                const updateUser = await User.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                updates.forEach(e => {
                    if (req.body[e]) {
                        updateUser[e] = req.body[e]
                    }
                })
                const {id, ...others} = updateUser.dataValues;
                const updatedUser = others
                const editUser = await User.update(updatedUser, {
                    where: {
                        id: req.params.id
                    },
                    individualHooks: true
                })
                console.log(editUser);
                const role = req.role
                const editedUser = editUser[1][0].dataValues
                res.status(200).send({"success": 200, "message": "admin successfully edited user details", "data":{editedUser, role}})
            }
            }
            
        }
        else {
            if ((req.role == "user" || "admin") && (!req.params.id)) {
                const updates = Object.keys(req.body)
                const allowedUpdates = ['firstname', 'lastname', 'email']
                const validation = updates.every(e => { return allowedUpdates.includes(e) })
                if (!validation) {
                    return res.status(400).send({"error": 400, "message":"please enter valid update keys"})
                }
                else {
                    const updateUser = req.user;
                    updates.forEach(e => {
                        if (req.body[e]) {
                            updateUser[e] = req.body[e]
                        }
                    })

                    const editUser = await User.update(updateUser, {
                        where: {
                            id: req.user.id
                        },
                        individualHooks: true
                    })
                    const role = req.role
                    const editedUser = editUser[1][0].dataValues
                    res.status(200).send({"status": 200, "message": "user or admin edited details successfully", "data":{editedUser, role}})
                }

            }
        }

    }
    catch (err) {
        res.status(400).send(err)
    }
}

const logoutUser = async (req, res) => {
    try {
        const exitUser = await User.update({
            token: null
        }, {
            where: {
                email: req.user.email
            },
            individualHooks: true
        })
        res.status(200).send({"success": 200, "message":"user logged out successfully", "data":exitUser[1][0].dataValues})
    }
    catch (err) {
        res.status(400).send(err)
    }
}

const deleteUser = async(req,res) => {
    try{
        if((req.role == "admin") && (req.params.id) && (req.params.id!= req.user.id)) {
          if(req.editUserRole == "admin") {
            res.status(400).send({"error": 400, "message":"cannot delete another admin "})
          } 
          else{
              const user = await User.destroy({
                  where: {
                      id: req.params.id
                  }
              })
              res.sendStatus(200)
          }
        }
        else {
            if((req.role == "admin" || req.role == "user") && (!req.params.id)) {
                const user = await User.destroy({
                    where: {
                        id: req.user.id
                    }
                })
                res.sendStatus(200)
            }
           
        }
 
    }
    catch(err) {
        res.status(400).send(err)
    }
}
module.exports = {
    getUsersList,
    createUser,
    checkUser,
    createPassword,
    loginUser,
    loginUserWithToken,
    forgotPassword,
    changePassword,
    editUser,
    logoutUser,
    deleteUser
}