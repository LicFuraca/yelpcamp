const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')

const renderRegister = (req, res) => {
    res.render('./users/register')
}

const registerUser = catchAsync(async (req, res) => {
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

const renderLogin = (req, res) => {
    res.render('./users/login')
}

const loginUser = (req, res) => {
    req.flash('Success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err)

        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    })
}

module.exports = { renderRegister, registerUser, renderLogin, loginUser, logoutUser }
