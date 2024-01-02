const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const Campground = require('../models/campground')
const validateReview = require('../middleware/validateReview')

router.post(
    '/',
    validateReview,
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id)
        const review = new Review(req.body.review)

        campground.reviews.push(review)
        req.flash('success', 'Created new review!')

        await campground.save()
        await review.save()

        res.redirect(`/campgrounds/${id}`)
    })
)

router.delete(
    '/:idReview',
    catchAsync(async (req, res) => {
        const { id, idReview } = req.params
        const review = await Review.findByIdAndDelete(idReview)
        const campground = await Campground.findByIdAndUpdate(id, { $pull: { review: idReview } })

        req.flash('success', 'Deleted review!')
        res.redirect(`/campgrounds/${id}`)
    })
)

module.exports = router
