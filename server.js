const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const errorHandler = require('./middlewares/error')
const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })

// Routers
const bootcampsRouter = require('./routes/bootcamps')
const coursesRouter = require('./routes/courses')

connectDB()

const app = express()

// Body Parser
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// File uploading
app.use(fileupload())

// Set static folder, so we can access this folder like: http://localhost:5000/uploads/sample.jpg
app.use(express.static(path.join(__dirname, 'public')))

// Mount Routes
app.use('/api/v1/bootcamps', bootcampsRouter)
app.use('/api/v1/courses', coursesRouter)

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
