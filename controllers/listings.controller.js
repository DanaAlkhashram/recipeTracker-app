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
    const foundrecipes = await Recipe.find()
    res.render('recipes/index.ejs', { foundrecipes: foundrecipes })
  } catch (err) {
    console.log(err)
    res.send('Something went wrong')
  }
})

// VIEW A SINGLE LISTING
router.get('/:recipeId', async (req, res) => {
  try {
    const foundrecipes = await Recipe.findById(req.params.recipeId).populate('chef')
    res.render('recipes/show.ejs', { foundrecipes})
  } catch (error) {
    console.log(error)
    res.redirect('/recipes')
  }
})

// DELETE LISTING FROM DATABASE
router.delete('/:recipeId', isSignedIn, async (req, res) => {
  const foundrecipes = await Recipe.findById(req.params.recipeId).populate('chef')

  if (foundrecipes.chef._id.equals(req.session.user._id)) {
    await foundrecipes.deleteOne()
    return res.redirect('/recipes')
  }
  return res.send('Not authorized')
})

// RENDER THE EDIT FORM VIEW
router.get('/:recipeId/edit', isSignedIn, async (req, res) => {
  const foundrecipes = await Recipe.findById(req.params.recipeId).populate('chef')

  if (foundrecipes.chef._id.equals(req.session.user._id)) {
    res.render('recipes/edit.ejs', { foundrecipes})
  }
  return res.send('Not authorized')
})


module.exports = router