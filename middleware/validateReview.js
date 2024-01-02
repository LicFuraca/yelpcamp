const { reviewSchema } = require('../schemas')
const ExpressError = require('../utils/ExpressError')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(errorObj => errorObj.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports = validateReview
