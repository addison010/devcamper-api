const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const Bootcamp = require('./models/Bootcamp')

// Load env vars

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

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    console.log('Data Imported...'.green.inverse)
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
    console.log('Data Destroyed...'.red.inverse)
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
