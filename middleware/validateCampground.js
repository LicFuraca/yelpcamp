const ExpressError = require('../utils/ExpressError')
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

module.exports = validateCampground
