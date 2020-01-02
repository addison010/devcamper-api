const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const errorHandler = require('./middlewares/error')
const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })

// Routers
const bootcampsRouter = require('./routes/bootcamps')
const coursesRouter = require('./routes/courses')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const reviewsRouter = require('./routes/reviews')

connectDB()

const app = express()

// Body Parser
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// File uploading
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xssClean())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // Limit to only allow 100 requests per 10 mins
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// Set static folder, so we can access this folder like: http://localhost:5000/uploads/sample.jpg
app.use(express.static(path.join(__dirname, 'public')))

// Mount Routes
app.use('/api/v1/bootcamps', bootcampsRouter)
app.use('/api/v1/courses', coursesRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/reviews', reviewsRouter)

// Use errorHandler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
})

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // close server & exit process
  server.close(() => {
    process.exit(1)
  })
})
