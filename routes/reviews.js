const express = require('express')
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews')
const Review = require('../models/Review')
const advancedResults = require('../middlewares/advancedResults')

// Merge params from other re-routed router
const router = express.Router({ mergeParams: true })

const { protect, authorize } = require('../middlewares/auth')

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), createReview)

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview)

module.exports = router
