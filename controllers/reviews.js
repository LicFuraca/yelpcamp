const catchAsync = require('../utils/catchAsync')

const Review = require('../models/review')
const Campground = require('../models/campground')

const createReview = catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)

    await campground.save()
    await review.save()

    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${id}`)
})

const deleteReview = catchAsync(async (req, res) => {
    const { id, idReview } = req.params
    const review = await Review.findByIdAndDelete(idReview)
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { review: idReview } })

    req.flash('success', 'Deleted review!')
    res.redirect(`/campgrounds/${id}`)
})

module.exports = { createReview, deleteReview }
