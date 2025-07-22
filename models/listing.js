const mongoose = require('mongoose')
const Schema = mongoose.Schema


const commentSchema = new mongoose.Schema({
    comment:String,
    authOr: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

const recipelSchema = new mongoose.Schema({
    title: String,
    ingredients: String,
    steps: String,
    image: String,
    chef: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true })

module.exports = mongoose.model('Recipe', recipelSchema)