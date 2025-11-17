const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const todoRoutes = require('./routes/todoRoutes')

dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

app.use('/api/todos', todoRoutes)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})