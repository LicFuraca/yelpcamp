const express = require('express')
const router = express.Router()
const passport = require('passport')
const isLoggedIn = require('../middleware/login')
const storeReturnTo = require('../middleware/returnTo')
const { renderRegister, registerUser, renderLogin, loginUser, logoutUser } = require('../controllers/users')

router.get('/register', renderRegister)
router.post('/register', registerUser)

router.get('/login', renderLogin)
router.post(
    '/login',
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    loginUser
)

router.get('/logout', isLoggedIn, logoutUser)

module.exports = router
