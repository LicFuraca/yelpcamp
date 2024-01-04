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

router.get('/', index)

router.get('/new', isLoggedIn, renderNew)
router.post('/', isLoggedIn, validateCampground, createCampground)

router.get('/:id', showCampground)
router.get('/:id/edit', isLoggedIn, isAuthor, renderEditCampground)
router.put('/:id', isLoggedIn, isAuthor, validateCampground, editCampground)

router.delete('/:id', isLoggedIn, isAuthor, deleteCampground)

module.exports = router
