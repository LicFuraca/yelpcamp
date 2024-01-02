const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const isLoggedIn = require('../middleware/login')
const isAuthor = require('../middleware/authorization')
const validateCampground = require('../middleware/validateCampground')

router.get(
    '/',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({})
        res.render('./campgrounds/index', { campgrounds })
    })
)

router.post(
    '/',
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const newCampground = new Campground(req.body)
        newCampground.author = req.user._id

        await newCampground.save()

        req.flash('success', 'Successfully created a new campground!')
        res.redirect(`/campgrounds/${newCampground._id}`)
    })
)

router.get('/new', isLoggedIn, (req, res) => {
    res.render('./campgrounds/new')
})

router.get(
    '/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id)

        if (!campground) {
            req.flash('error', 'Cannot find that campground.')
            res.redirect('/campgrounds')
            return
        }

        res.render('campgrounds/edit', { campground })
    })
)

router.put(
    '/:id',
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
        req.flash('success', 'Successfully updated campground!')

        res.redirect(`/campgrounds/${campground.id}`)
    })
)

router.delete(
    '/:id',
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findByIdAndDelete(id)

        res.redirect('/campgrounds')
    })
)

router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id).populate('reviews').populate('author')

        if (!campground) {
            req.flash('error', 'Cannot find that campground.')
            res.redirect('/campgrounds')
            return
        }

        res.render('campgrounds/campground-detail', { campground })
    })
)

module.exports = router
