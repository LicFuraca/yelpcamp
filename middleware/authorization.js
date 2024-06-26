const Campground = require('../models/campground')

const isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)

    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.')

        return res.redirect(`/campgrounds/${id}`)
    } else {
        next()
    }
}

module.exports = isAuthor
