const express = require('express')
const router = express.Router({ mergeParams: true })

const validateReview = require('../middleware/validateReview')
const isLoggedIn = require('../middleware/login')
const isReviewAuthor = require('../middleware/isReviewAuthor')
const { createReview, deleteReview } = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, createReview)
router.delete('/:idReview', isLoggedIn, isReviewAuthor, deleteReview)

module.exports = router
