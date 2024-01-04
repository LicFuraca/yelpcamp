const express = require('express')
const router = express.Router()
const passport = require('passport')
const isLoggedIn = require('../middleware/login')
const storeReturnTo = require('../middleware/returnTo')
const { renderRegister, registerUser, renderLogin, loginUser, logoutUser } = require('../controllers/users')

router.route('/register').get(renderRegister).post(registerUser)

router
    .route('/login')
    .get(renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loginUser)

router.get('/logout', isLoggedIn, logoutUser)

module.exports = router
