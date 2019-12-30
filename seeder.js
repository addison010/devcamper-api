const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// Load env vars
dotenv.config({ path: './config/config.env' })

const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
)

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    console.log('Bootcamps Imported...'.green.inverse)
    await Course.create(courses)
    console.log('Courses Imported...'.green.inverse)
  } catch (err) {
    console.error(err)
  } finally {
    process.exit()
  }
}

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    console.log('Bootcamps Destroyed...'.red.inverse)
    await Course.deleteMany()
    console.log('Courses Destroyed...'.red.inverse)
  } catch (err) {
    console.error(err)
  } finally {
    process.exit()
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
