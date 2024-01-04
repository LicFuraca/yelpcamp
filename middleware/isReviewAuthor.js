const Review = require('../models/review')

const isReviewAuthor = async (req, res, next) => {
    const { id, idReview } = req.params
    const review = await Review.findById(idReview)

    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that.")
        return res.redirect(`/campgrounds/${id}`)
    }

    next()
}

module.exports = isReviewAuthor
