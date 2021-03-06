const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } else {
    return res.status(200).json(res.advancedResults)
  }
})

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })

  if (!review) {
    return next(new ErrorResponse('Review not found', 404))
  }

  return res.status(200).json({
    success: true,
    data: review
  })
})

// @desc    Create new review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(new ErrorResponse('Bootcamp not found', 404))
  }

  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user._id

  const review = await Review.create(req.body)

  return res.status(201).json({
    success: true,
    data: review
  })
})

// @desc    Update Review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(new ErrorResponse('Review not found', 404))
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update review', 401))
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  return res.status(200).json({
    success: true,
    data: review
  })
})

// @desc    Delete Review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(new ErrorResponse('Review not found', 404))
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update review', 401))
  }

  await Review.findByIdAndDelete(req.params.id)

  return res.status(200).json({
    success: true,
    data: {}
  })
})
