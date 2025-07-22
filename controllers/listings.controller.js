const express = require('express')
const router = express.Router()
const isSignedIn = require('../middleware/is-signed-in')
const Recipe = require('../models/listing')

// NEW LISTING FORM
router.get('/new', isSignedIn, (req, res) => {
    res.render('recipes/new.ejs')
    //   res.send('The /new route is working!')
})

// POST FORM DATA TO DATABASE
router.post('/', isSignedIn, async (req, res) => {
    try {
        req.body.chef = req.session.user._id
        await Recipe.create(req.body)
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.send('Something went wrong')
    }
})

// VIEW ALL LISTINGS
router.get('/', async (req, res) => {
    try {
        const foundrecipe = await Recipe.find()
        res.render('recipes/index.ejs', { foundrecipe: foundrecipe })
    } catch (err) {
        console.log(err)
        res.send('Something went wrong')
    }
})

// VIEW A SINGLE LISTING
router.get('/:recipeId', async (req, res) => {
    try {
        const foundrecipe = await Recipe.findById(req.params.recipeId).populate('chef').populate('comments.author')
        res.render('recipes/show.ejs', { foundrecipe: foundrecipe })
    } catch (error) {
        console.log(error)
        res.redirect('/recipes')
    }
})

// DELETE LISTING FROM DATABASE
router.delete('/:recipeId', isSignedIn, async (req, res) => {
    const foundrecipe = await Recipe.findById(req.params.recipeId).populate('chef')

    if (foundrecipe.chef._id.equals(req.session.user._id)) {
        await foundrecipe.deleteOne()
        return res.redirect('/recipes')
    }
    return res.send('Not authorized')
})

// RENDER THE EDIT FORM VIEW
router.get('/:recipeId/edit', isSignedIn, async (req, res) => {
    try {
        const foundrecipe = await Recipe.findById(req.params.recipeId).populate('chef')

        if (foundrecipe.chef._id.equals(req.session.user._id)) {
            res.render('recipes/edit.ejs', { foundrecipe: foundrecipe })
        }
    } catch (err) {
        console.log(err)
        return res.send('Not authorized')
    }

})

// HANDLE EDIT FORM SUBMISSION 
router.put('/:recipeId', isSignedIn, async (req, res) => {
    try {
        const foundrecipe = await Recipe.findById(req.params.recipeId).populate('chef')

        if (foundrecipe.chef._id.equals(req.session.user._id)) {
            await Recipe.findByIdAndUpdate(req.params.recipeId, req.body, { new: true })
            return res.redirect(`/recipes/${req.params.recipeId}`)
        }
    } catch (err) {
        console.log(err)
        return res.send('Not authorized')
    }
})

// POST COMMENT FORM TO THE DATABASE
router.post('/:recipeId/comments', isSignedIn, async (req, res) => {
    const foundrecipe = await Recipe.findById(req.params.recipeId).populate('chef').populate('comments.author')
    req.body.author = req.session.user._id

    foundrecipe.comments.push(req.body)
    await foundrecipe.save()
    res.redirect(`/recipes/${req.params.recipeId}`)
})

router.put('/:recipeId/comments/:commentId', isSignedIn, async (req, res) => {
    try {
        const foundrecipe = await Recipe.findById(req.params.recipeId).populate('comments.author')
        const comment = foundrecipe.comments.id(req.params.commentId)

        if (comment.author.equals(req.session.user._id)) {
            comment.content = req.body.content
            await foundrecipe.save()
            res.redirect(`/recipes/${req.params.recipeId}`)
        }
    } catch (err) {
        console.log(err)
        return res.send('Not authorized')

    }
})

router.delete('/:recipeId/comments/:commentId', isSignedIn, async (req, res) => {
    try {
        const foundrecipe = await Recipe.findById(req.params.recipeId).populate('comments.author')
        const comment = foundrecipe.comments.id(req.params.commentId);
        if (!comment) {
            return res.send('Comment not found');
        }
        if (comment.author.equals(req.session.user._id)) {
            comment.deleteOne()
            await foundrecipe.save()
            res.redirect(`/recipes/${req.params.recipeId}`)
        }
    } catch (err) {
        console.log(err)
        return res.send('Not authorized')
    }
})



module.exports = router