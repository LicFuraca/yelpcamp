if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanatize = require('express-mongo-sanitize')

const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const path = require('path')
const ExpressError = require('./utils/ExpressError')

const campgroundsRouter = require('./routes/campgrounds')
const reviewsRouter = require('./routes/reviews')
const userRouter = require('./routes/users')
const User = require('./models/user')
const helmet = require('helmet')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const oneWeek = 1000 * 60 * 60 * 24 * 7
const sessionConfig = {
    name: 'session',
    secret: 'jaja',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + oneWeek,
        maxAge: oneWeek,
    },
}

const scriptSrcUrls = [
    'https://stackpath.bootstrapcdn.com/',
    'https://cdn.jsdelivr.net',
    'https://kit.fontawesome.com/',
    'https://cdnjs.cloudflare.com/',
    'https://cdn.jsdelivr.net',
]
const styleSrcUrls = [
    'https://kit-free.fontawesome.com/',
    'https://stackpath.bootstrapcdn.com/',
    'https://cdn.jsdelivr.net/',
    'https://fonts.googleapis.com/',
    'https://use.fontawesome.com/',
]

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(mongoSanatize())
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: [
                "'self'",
                'blob:',
                'data:',
                'https://res.cloudinary.com/doa6m6shv/',
                'https://images.unsplash.com/',
            ],
            fontSrc: ["'self'"],
        },
    })
)

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.signedInUser = req.user
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
app.use('/', userRouter)

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
