const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const path = require('path')
const ExpressError = require('./utils/ExpressError')

const campgroundsRouter = require('./routes/campgrounds')
const reviewsRouter = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

const oneWeek = 1000 * 60 * 60 * 24 * 7
const sessionConfig = {
    secret: 'jaja',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + oneWeek,
        maxAge: oneWeek,
    },
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Base de datos conectada.'))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/campgrounds', campgroundsRouter)
app.use('/campgrounds/:id/reviews', reviewsRouter)

// HOME
app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err

    if (!err.message) err.message = 'Something went wrong'

    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => console.log('Puerto localhost:3000, proyecto YelpCamp conectado.'))
