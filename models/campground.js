const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [{ type: Schema.ObjectId, ref: 'Review' }],
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) await Review.deleteMany({ _id: { $in: doc.reviews } })
})

const Campground = mongoose.model('Campground', CampgroundSchema)

module.exports = Campground
