import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

const app = express()
const port = 9004

app.use(bodyParser.json())

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
