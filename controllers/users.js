const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const User = require('../models/User')

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})

// @desc    Get single user by ID
// @route   GET /api/v1/users/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorResponse('The requesting user is not found', 404))
  }

  return res.status(200).json({
    success: true,
    data: user
  })
})

// @desc    Create new user
// @route   POST /api/v1/users/
// @access  Private
exports.createUser = asyncHandler(async (req, res, next) => {
  const userExisted = await User.findOne({
    email: req.body.email
  })

  if (userExisted) {
    return next(
      new ErrorResponse(
        `Email [${req.body.email}] has already been registered`,
        400
      )
    )
  }

  const user = await User.create(req.body)

  // Hide password
  user.password = undefined

  return res.status(201).json({
    success: true,
    data: user
  })
})

// @desc    Update user by ID
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const userExisted = await User.findById(req.params.id)

  if (!userExisted) {
    return next(
      new ErrorResponse(`User with ID: ${req.params.id} is not found`, 404)
    )
  }

  const fieldsToUpdate = {
    name: req.body.name || userExisted.name,
    email: req.body.email || userExisted.email,
    role: req.body.role || userExisted.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  return res.status(200).json({
    success: true,
    data: user
  })
})

// @desc    Delete user by ID
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const userExisted = await User.findById(req.params.id)

  if (!userExisted) {
    return next(
      new ErrorResponse(`User with ID: ${req.params.id} is not found`, 404)
    )
  }

  await userExisted.remove()

  return res.status(200).json({
    success: true,
    data: userExisted
  })
})
