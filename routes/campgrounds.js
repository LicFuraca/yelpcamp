const express = require('express')
const router = express.Router()

const isLoggedIn = require('../middleware/login')
const isAuthor = require('../middleware/authorization')
const validateCampground = require('../middleware/validateCampground')
const {
    index,
    renderNew,
    createCampground,
    renderEditCampground,
    showCampground,
    deleteCampground,
    editCampground,
} = require('../controllers/campgrounds')

router.route('/').get(index).post(isLoggedIn, validateCampground, createCampground)

router.get('/new', isLoggedIn, renderNew)

router
    .route('/:id')
    .get(showCampground)
    .put(isLoggedIn, isAuthor, validateCampground, editCampground)
    .delete(isLoggedIn, isAuthor, deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, renderEditCampground)

module.exports = router
