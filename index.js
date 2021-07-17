const express = require('express')
const connectDB = require('./config/db')
const app = express()
const cors = require('cors')

app.use(cors())
connectDB()
app.use(express.json({ extended: true }))
const PORT = process.env.PORT || 4000

app.use('/api/user', require('./routes/UserRoute'))
app.use('/api/auth', require('./routes/AuthRoute'))
app.use('/api/projects', require('./routes/ProjectsRoute'))
app.use('/api/tasks', require('./routes/TasksRoute'))

app.listen(PORT, () => {
  console.log(`Running server in the port: ${PORT}`)
})
