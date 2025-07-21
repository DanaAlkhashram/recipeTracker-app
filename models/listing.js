const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title: String,
    description: String,
    steps: String,
    image: String,
    chef: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Listing', listingSchema)