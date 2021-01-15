const express = require('express')
const Role = require('../models/role')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { welcomeEmail, forgotPasswordEmail } = require('../emails/email')
const log = require('../logs/logger')
const {Op} = require('sequelize')



const getUsersList = async (req, res) => {
    try {
        log.info('Incoming request to getUsersList')
        const role = req.role
        if (role == "admin") {
            log.info('Incoming request to getUsersList by admin')
            const usersList = await User.findAll({
                where: {
                    id: {
                        [Op.ne]: req.user.id
                    }
                },
                attributes: {
                    exclude: ['password', 'token', 'role_id', 'resetPasswordToken']
                },
                include: {
                    model: Role,
                    attributes: ['name']
                }
            })
            log.info('Outgoing response from getUserslList by admin', {"response" : usersList})
            res.status(200).send({"success": 200, "message": "admin sees the list of users", "data" :usersList})
        }
        else {
            if (role == "user") {
                log.info('Incoming request to getUsersList by user')
                const userList = await User.findAll({
                    where: {
                        id: {
                            [Op.ne]: req.user.id
                        },
                        role_id: req.user.role_id
                    },
                    attributes: ['firstname', 'lastname', 'email', 'status']
                })
                log.info('Outgoing response from getUsersList by user', {"response": userList} )
                res.status(200).send({"success": 200, "message": "user sees the list of users", "data" :userList})
            }
        }

    }
    catch (err) {
        log.error('Error accessing getUsersList', {"error": err})
        res.status(400).send({"error": 400, "message": err.message})
    }

}

const createUser = async (req, res) => {
    const { role, link, ...others } = req.body;
    try {
        log.info('Incoming request to createUser', {"request": req.body})
        const user = { ...others, role_id: req.roleId }
        const createUser = await User.create(user)
        welcomeEmail(req.body.firstname, req.body.email, link+`?action=setPassword&token=${createUser.dataValues.resetPasswordToken}`)
        const newUser = createUser.dataValues
        log.info('Outgoing response from createUser', {"response": {newUser, role}})
        res.status(201).send({"success": 201, "message": "admin creates users", "data" : {newUser, role}})
    }
    catch (err) {
        log.error('Error accessing createUser', {"error": err})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }}
    }


const createPassword = async (req, res) => {
    try {
        log.info('Incoming request to createPassword', {"request": req.body})
        if (req.query.token) {
            const addPassword = await User.update({
                password: req.body.password
            }, {
                where: {
                    email: req.user.email
                },
                individualHooks: true
            })
            // res.setHeader('Content-Type', 'application/json')
            log.info('Outgoing response from createPassword', {"response": "redirected to login"})
            res.redirect(`http://user-dashboard.qburst.build:3002/user/login?action=login&token=${req.token}`)
            // res.redirect(`http://localhost:3002/user/login?action=login&token=${req.token}`)


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
        log.info('Outgoing response from createPassword', {"response": addPassword[1][0].dataValues})
        res.status(200).send({"success": 200, "message": "user sets password", "data" : addPassword[1][0].dataValues})
        }

    }
    catch (err) {
        log.error('Error accessing createPassword', {"error": err})
        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }}
    }

const checkUser = async (req, res) => {
    try {
        log.info('Incoming request to checkUser', {"request": req.body})
        const checkEmail = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        if (checkEmail.status == "pending") {
            log.info('Outgoin response from checkUser', {"response": checkEmail.status})

            res.status(200).send({"success": 200, "message": "check if user exist and if new user", "data" : checkEmail.status})
        }
        else {
            if(checkEmail.status == "inactive") {
                log.error('Error response from checkUser', {"error": "user inactive"})

                res.status(403).send({"error": 403, "message": "user inactive"})
            }
            else {
                log.info('Error response from checkUser', {"error": "user exist"})

                res.status(200).send({"success": 200, "message": "user exist"})
            }
        }
    }
    catch (err) {
        log.error('Error accessing checkUser', {"error": err || 'email doesnt exist'})

        res.status(400).send({"error": 400, "message": {"error": 400, "message": err.message || "email doesnt exist"}})
    }
}

const loginUser = async (req, res) => {
    try {
        log.info('Incoming request to loginUser', {"request": req.body})

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
                        log.error('Error response from checkUser', {"error": "user inactive"})

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
                        log.info('Outgoin response from loginUser', {"response":  {loggedUser,role}})

                        res.status(200).send({"success": 200, "message": "user logged in successfully", "data":{loggedUser, role}})
                    }
                   
                }
                else {
                    log.error('Error response from loginUser', {"error": "password doesnt match"})

                    res.status(401).send({"error": 401, "message": "password doesnt match"})
                }
            }
            
        else {
            log.error('Error response from loginUser', {"error": "please enter correct email"})

            res.status(401).send({"error": 400, "message": "please enter correct email"})
        }

    }
    catch (err) {
        log.error('Error accessing loginUser', {"error": err })

        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }}
    }

const loginUserWithToken = async (req, res) => {
    try {
        log.info('Incoming request to loginUserWithToken', {"request": req.user})

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
        // res.setHeader('Content-Type', 'application/json')
        log.info('Outgoin response from loginUserWithToken', {"response":  {loggedUser,role}})

        res.status(200).send({"success": 200, "message": "user logged in successfully with token", "data":{loggedUser, role}})
    }
    catch (err) {
        log.error('Error accessing loginUserWithToken', {"error": err })

        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }}
    }

const forgotPassword = async (req, res) => {
    try {
        log.error('Incoming request to forgotPassword', {"request": req.body})

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
            forgotPasswordEmail(updateResetToken[1][0].dataValues.firstname, updateResetToken[1][0].dataValues.email, req.body.link+`?action=${action}&token=${resetToken}`)
            log.error('Outgoin response from forgotPassword', {"response":  "mail sent"})
            
            res.status(200).send({"success": 200, "message":"mail sent"})
        }
        else {
            log.error('Error response from forgotPassword', {"error": "please provide the link to attach to the mail"})

            res.status(400).send({"error": 400, "message": "please provide the link to attach to the mail"})
        }
    }
    catch (err) {
        log.error('Error accessing forgotPassword', {"error": err.error[0].message })

        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }}
    }

const changePassword = async (req, res) => {
    try {
        log.info('Incoming request to changePassword', {"request": req.body})

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
                log.info('Outgoin response from changePassword', {"response": {changePasswordUser, role}})

                res.status(200).send({"success": 200, "message": "user changed password successfully", "data":{changePasswordUser, role}})
            }
            else {
                log.error('Error response from changePassword', {"error": "no change in password"})

                res.status(400).send({"error": 400, "message": "no change in password"})
            }
        }
        else {
            log.error('Error response from changePassword', {"error":  "entered wrong old password"})
            
            res.status(404).send({"error": 404, "message": "entered wrong old password"})
        }
    }
    catch (err) {
        log.error('Error accessing changePassword', {"error": err })

        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }}
    }

const editUser = async (req, res) => {
    try {

        if ((req.role == "admin") && (req.params.id) && (req.params.id != req.user.id)) {
            log.info('Incoming request to editUser by admin', {"request": req.body})
            if(req.editUserRole == "admin") {
                log.error('Error response from editUser by admin', {"error":  "cannot edit admin details"})

                return res.status(400).send({"error": 400, "message": "cannot edit admin details"})
            }
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
            const allowedUpdates = ['firstname', 'lastname', 'status', 'role_id']
            const validation = updates.every(e => { return allowedUpdates.includes(e) })
            if (!validation) {
                log.error('Error response from editUser by admin', {"error":  "please enter valid update keys"})

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
                const {id, createdAt, updatedAt, password, ...others} = updateUser.dataValues;
                const updatedUser = await User.update(others, {
                    where: {
                        id: req.params.id
                    },
                    individualHooks: true
                })
                const role = req.role
                const editedUser = updatedUser[1][0].dataValues
                log.info('Outgoin response from editUser by admin', {"response": {editedUser, role}})

                res.status(200).send({"success": 200, "message": "admin successfully edited user details", "data":{editedUser, role}})
            }
            
        }
        else {
            if ((req.role == "user" || "admin") && (!req.params.id)) {
                log.info('Incoming request to editUser by user or admin', {"request": req.body})

                const updates = Object.keys(req.body)
                const allowedUpdates = ['firstname', 'lastname', 'email']
                const validation = updates.every(e => { return allowedUpdates.includes(e) })
                if (!validation) {
                    log.error('Error response from editUser by user or admin', {"error":  "please enter valid update keys"})

                    return res.status(400).send({"error": 400, "message":"please enter valid update keys"})
                }
                else {
                    const updateUser = req.user;
                    updates.forEach(e => {
                        if (req.body[e]) {
                            updateUser[e] = req.body[e]
                        }
                    })
                    const {id, createdAt, updatedAt, password, ...others} = updateUser;
                    const editUser = await User.update(others, {
                        where: {
                            id: req.user.id
                        },
                        individualHooks: true
                    })
                    const role = req.role
                    const editedUser = editUser[1][0].dataValues
                    log.info('Outgoin response from editUser by user or admin', {"response": {editedUser, role}})

                    res.status(200).send({"status": 200, "message": "user or admin edited details successfully", "data":{editedUser, role}})
                }

            }
        }

    }
    catch (err) {
        log.error('Error accessing editUser', {"error": err})

        if(err.errors) {
            res.status(400).send({"error": 400, "message":  err.errors[0].message})
        }
        else{
            res.status(400).send({"error": 400, "message": err.message })

        }}
    }

const logoutUser = async (req, res) => {
    try {
        log.info('Incoming request to logoutUser')

        const exitUser = await User.update({
            token: null
        }, {
            where: {
                email: req.user.email
            },
            individualHooks: true
        })
        log.info('Outgoin response from logoutUser', {"response": "user logged out successfully"})

        res.status(200).send({"success": 200, "message":"user logged out successfully"})
    }
    catch (err) {
        log.error('Error accessing logoutUser', {"error": err })

        res.status(400).send({"error": 400, "message": err.message})
    }
}

const deleteUser = async(req,res) => {
    try{
        if((req.role == "admin") && (req.params.id) && (req.params.id!= req.user.id)) {
            log.info('Incoming request to deleteUser by admin', {"request": req.params.id})

          if(req.editUserRole == "admin") {
            log.error('Error response from deleteUser by admin', {"error":  "cannot delete another admin "})

            return res.status(400).send({"error": 400, "message":"cannot delete another admin "})
          } 
          else{
              const user = await User.destroy({
                  where: {
                      id: req.params.id
                  }
              })
            log.info('Outgoin response from deleteUser by admin', {"response": "user deleted successfully"})

              res.sendStatus(200)
          }
        }
        else {
            if((req.role == "admin" || req.role == "user") && (!req.params.id)) {
                log.info('Incoming request to deleteUser by user or admin', {"request": req.params.id})

                const user = await User.destroy({
                    where: {
                        id: req.user.id
                    }
                })
                log.info('Outgoin response from deleteUser by user or admin', {"response": "user deleted successfully"})

                res.sendStatus(200)
            }
           
        }
 
    }
    catch(err) {
        log.error('Error accessing deleteUser', {"error": err })

        res.status(400).send({"error": 400, "message": err.message})
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