const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const { campgroundSchema, reviewSchema } = require('./schemas')

const path = require('path')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Base de datos conectada.'))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(errObj => errObj.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(errorObj => errorObj.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// HOME
app.get('/', (req, res) => {
    res.render('home')
})

// ALL CAMPGROUNDS
app.get(
    '/campgrounds',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({})
        res.render('./campgrounds/index', { campgrounds })
    })
)

// NEW CAMPGROUND
app.post(
    '/campgrounds',
    validateCampground,
    catchAsync(async (req, res, next) => {
        // if (!req.body) throw new ExpressError('Invalid campground data', 400)
        const newCampground = new Campground(req.body)
        await newCampground.save()

        res.redirect(`/campgrounds/${newCampground._id}`)
    })
)

app.get('/campgrounds/new', (req, res) => {
    res.render('./campgrounds/new')
})

app.get(
    '/campgrounds/:id/edit',
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id)

        res.render('campgrounds/edit', { campground })
    })
)

// UPDATE CAMPGROUND
app.put(
    '/campgrounds/:id',
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findByIdAndUpdate(id, req.body)

        res.redirect(`/campgrounds/${campground.id}`)
    })
)

// DELETE CAMPGROUND
app.delete(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findByIdAndDelete(id)

        res.redirect('/campgrounds')
    })
)

// DETAIL PAGE CAMPGROUND
app.get(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id)

        res.render('campgrounds/campground-detail', { campground })
    })
)

app.post(
    '/campgrounds/:id/reviews',
    validateReview,
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = await Campground.findById(id)
        const review = new Review(req.body)

        campground.reviews.push(review)

        await campground.save()
        await review.save()

        res.redirect(`/campgrounds/${id}`)
    })
)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err

    if (!err.message) err.message = 'Something went wrong'

    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => console.log('Puerto localhost:3000, proyecto YelpCamp conectado.'))
