const Joi = require('joi')

const campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    deleteImages: Joi.array(),
})

module.exports.campgroundSchema = campgroundSchema

const reviewSchema = Joi.object({
    review: Joi.object({ rating: Joi.number().required().min(0).max(5), body: Joi.string().required() }).required(),
})

module.exports.reviewSchema = reviewSchema
