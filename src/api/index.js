import { Router } from 'express'
import { Sprint, Task, Board, User } from '../models'

const api = Router()

api.get('/api/users', (req, res) => {
  User.find({}, (error, response) => {
    if (error) return res.json(error)
    return res.json(response)
  })
})

api.get('/api/sprints', (req, res) => {
  Sprint.find({}, (error, response) => {
    if (error) return res.json(error)
    return res.json(response)
  })
})

api.get('/api/boards', (req, res) => {
  Board.find({}, (error, response) => {
    if (error) return res.json(error)
    return res.json(response)
  })
})

api.get('/api/tasks', (req, res) => {
  Task.find({}, (error, response) => {
    if (error) return res.json(error)
    return res.json(response)
  })
})

api.get('/api/sprint/:id', (req, res) => {
  res.send('im the about page!')
})

api.post('/api/sprint', (req, res) => {
  const sprintPost = new Sprint({
    name: req.body.name
  })

  sprintPost.save((error, response) => {
    if (error) {
      console.error(error)
      return res.send(error)
    }
    return res.send(response)
  })
})

api.post('/api/user', (req, res) => {
  const { mail, user, first, last, descr, interests, isAdmin, born } = req.body
  const userPost = new User({
    mail,
    user,
    first,
    last,
    descr,
    interests,
    isAdmin,
    born
  })

  userPost.save((error, response) => {
    if (error) {
      console.error(error)
      return res.send(error)
    }
    return res.send(response)
  })
})

api.post('/api/board', (req, res) => {
  const boardPost = new Board({
    title: req.body.title,
    descr: req.body.descr
  })

  boardPost.save((error, response) => {
    if (error) {
      console.error(error)
      return res.send(error)
    }
    return res.send(response)
  })
})

api.put('/api/sprint/:id', (req, res) => {
  const query = { _id: req.params.id }
  Sprint.findOneAndUpdate(query, { name: req.body.name }, (error, response) => {
    if (error) return res.json(error)
    return res.json(response)
  })
})

api.put('/api/task/:id', (req, res) => {
  const query = { _id: req.params.id }
  Task.findOneAndUpdate(query, { name: req.body.name }, (error, response) => {
    if (error) return res.json(error)
    return res.json(response)
  })
})

api.post('/api/task', (req, res) => {
  const { type, title, descr, days, hours, minutes } = req.body
  const taskPost = new Task({
    type,
    title,
    descr,
    days,
    hours,
    minutes
  })

  taskPost.save((error, response) => {
    if (error) {
      console.error(error)
      return res.json(error)
    }
    return res.json(response)
  })
})

export default api
