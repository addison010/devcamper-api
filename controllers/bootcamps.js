const Bootcamp = require('../models/Bootcamp')

// @desc    Get all bootcamps
// @method  GET
// @route   /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()

    return res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    })
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    })
  }
}

// @desc    Get single bootcamp by id
// @method  GET
// @route   /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
      return res.status(400).json({ success: false })
    }

    return res.status(200).json({
      success: true,
      data: bootcamp
    })
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    })
  }
}

// @desc    Create new bootcamp
// @method  POST
// @route   /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    return res.status(201).json({
      success: true,
      data: bootcamp
    })
  } catch (err) {
    console.log(err.message.red.bold)
    return res.status(400).json({
      success: false,
      error: err.message
    })
  }
}

// @desc    Update bootcamp by id
// @method  PUT
// @route   /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!bootcamp) {
      return res.status(400).json({ success: false })
    }

    return res.status(200).json({ success: true, data: bootcamp })
  } catch (err) {
    return res.status(400).json({ success: false })
  }
}

// @desc    Delete bootcamp
// @method  DELETE
// @route   /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
      return res.status(400).json({ success: false })
    }
    return res.status(200).json({ success: true, data: {} })
  } catch (err) {
    return res.status(400).json({ success: false })
  }
}
