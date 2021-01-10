const express = require('express')
const authenticateToken = require('../middleware/auth')
const Role = require('../models/role')
const User = require('../models/user')
const authorized = require('../middleware/admin')
const getRoleId = require('../middleware/roleId')
const { getUsersList,
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
} = require('../services/userServices')



const router = express.Router()

// Get list of users
router.get('/', authenticateToken, authorized(['admin', 'user']), getUsersList)

// create user by admin
router.post('/', authenticateToken, authorized(['admin']), getRoleId, createUser)



// create password 
router.put('/password', authenticateToken, authorized(['admin', 'user']), createPassword)

// check if user exist and if new user
router.post('/check', checkUser)

// log in user after verifying password and email
router.post('/login', loginUser)

// login using token attached to email
router.get('/login', authenticateToken, loginUserWithToken)


// forgot password
router.post('/password/forgot', forgotPassword)

// change password
router.put('/password/change', authenticateToken, authorized(['user', 'admin']), changePassword)


// edit user details
router.put('/:id?', authenticateToken, getRoleId, editUser)

// logout
router.post('/logout', authenticateToken, logoutUser)

// delete user
router.delete('/delete/:id?', authenticateToken, getRoleId, deleteUser)

module.exports = router