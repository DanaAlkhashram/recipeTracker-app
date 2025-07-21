const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipelSchema = new Schema({
    title: String,
    ingredients: String,
    steps: String,
    image: String,
    chef: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Recipe', recipelSchema)