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
const multer = require('multer')
const { storage } = require('../cloudinary/cloudinary')
const upload = multer({ storage })

router.route('/').get(index).post(isLoggedIn, upload.array('image'), validateCampground, createCampground)

router.get('/new', isLoggedIn, renderNew)

router
    .route('/:id')
    .get(showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, editCampground)
    .delete(isLoggedIn, isAuthor, deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, renderEditCampground)

module.exports = router
