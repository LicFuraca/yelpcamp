const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const passport = require('passport')
const isLoggedIn = require('../middleware/login')
const storeReturnTo = require('../middleware/returnTo')

router.get('/register', (req, res) => {
    res.render('./users/register')
})

router.post(
    '/register',
    catchAsync(async (req, res) => {
        try {
            const { email, username, password } = req.body
            const user = new User({ email, username })
            const registeredUser = await User.register(user, password)

            req.login(registeredUser, error => {
                if (error) return next(error)

                req.flash('success', 'Welcome to Yelp Camp!')
                res.redirect('/campgrounds')
            })
        } catch (error) {
            req.flash('error', error.message)
            res.redirect('/register')
        }
    })
)

router.get('/login', (req, res) => {
    res.render('./users/login')
})

router.post(
    '/login',
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res) => {
        req.flash('Success', 'Welcome back!')
        const redirectUrl = res.locals.returnTo || '/campgrounds'

        res.redirect(redirectUrl)
    }
)

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
