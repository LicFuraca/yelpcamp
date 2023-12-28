const express = require('express')
const router = express.Router()

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(errObj => errObj.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get(
    '/',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({})
        res.render('./campgrounds/index', { campgrounds })
    })
)

router.post(
    '/',
    validateCampground,
    catchAsync(async (req, res, next) => {
        // if (!req.body) throw new ExpressError('Invalid campground data', 400)
        const newCampground = new Campground(req.body)
        await newCampground.save()

        req.flash('success', 'Successfully created a new campground!')
        res.redirect(`/campgrounds/${newCampground._id}`)
    })
)

router.get('/new', (req, res) => {
    res.render('./campgrounds/new')
})

router.get(
    '/:id/edit',
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
        const campground = await Campground.findById(id).populate('reviews')

        if (!campground) {
            req.flash('error', 'Cannot find that campground.')
            res.redirect('/campgrounds')
            return
        }

        res.render('campgrounds/campground-detail', { campground })
    })
)

module.exports = router
