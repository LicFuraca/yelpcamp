const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const passport = require('passport')
const isLoggedIn = require('../middleware/login')

router.get('/register', (req, res) => {
    res.render('./users/register')
})

router.post(
    '/register',
    catchAsync(async (req, res) => {
        try {
            const { email, username, password } = req.body
            const user = new User({ email, username })
            await User.register(user, password)

            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        } catch (error) {
            req.flash('error', error.message)
            res.redirect('/register')
        }
    })
)

router.get('/login', (req, res) => {
    res.render('./users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('Success', 'Welcome back!')
    res.redirect('campgrounds')
})

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }

        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    })
})

module.exports = router
