const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary/cloudinary')

const index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('./campgrounds/index', { campgrounds })
})

const renderNew = (req, res) => res.render('campgrounds/new')

const createCampground = catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body)

    newCampground.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    newCampground.author = req.user._id

    await newCampground.save()

    req.flash('success', 'Successfully created a new campground!')
    res.redirect(`/campgrounds/${newCampground._id}`)
})

const renderEditCampground = catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)

    if (!campground) {
        req.flash('error', 'Cannot find that campground.')
        res.redirect('/campgrounds')
        return
    }

    res.render('campgrounds/edit', { campground })
})

const editCampground = catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body })
    const newImages = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campground.images.push(...newImages)
    await campground.save()

    const imgDelete = req.body.deleteImages

    if (imgDelete) {
        for (let filename of imgDelete) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: imgDelete } } } })
    }

    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground.id}`)
})

const showCampground = catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author')

    if (!campground) {
        req.flash('error', 'Cannot find that campground.')
        res.redirect('/campgrounds')
        return
    }

    res.render('campgrounds/campground-detail', { campground })
})

const deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)

    res.redirect('/campgrounds')
})

module.exports = {
    index,
    renderNew,
    createCampground,
    renderEditCampground,
    showCampground,
    deleteCampground,
    editCampground,
}
