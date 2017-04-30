import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import mongoose from 'mongoose'
import api from './src/api'

mongoose.connect('mongodb://localhost/crispyScrum')
const db = mongoose.connection

db.on('error', () => console.log('could not connect to db...'))
db.once('open', () => {
  console.log('connected to db...')
})

const app = express()
const port = 9004

app.use(bodyParser.json())

app.use('/', api)

app.use('/', express.static(path.join(__dirname, 'src', 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'public', 'app.html'))
})

app.get('/*', (req, res) => {
  res.redirect('/')
})

app.listen(port, () => {
  const message = `Server is running on http://localhost:${port}`
  console.log(message)
})
