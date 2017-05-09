import fs from 'fs'
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
  const sprintPost = new Sprint(req.body)

  sprintPost.save((error, response) => {
    if (error) {
      console.error(error)
      return res.send(error)
    }
    return res.send(response)
  })
})

api.post('/api/user', (req, res) => {
  const { mail, user, first, last, descr, interests, isAdmin, born, avatar } = req.body

  const userPost = new User({
    mail,
    user,
    first,
    last,
    descr,
    interests,
    isAdmin,
    born,
    avatar
  })

  userPost.save((error, response) => {
    if (error) {
      console.error(error)
      return res.send(error)
    }
    return res.send(response)
  })
})

api.post('/api/select/board', (req, res) => {
  const { user, board } = req.body
  const query = { _id: user }
  User.findOneAndUpdate(query, { board }, (error, response) => {
    if (error) return res.json(error)
    return res.json(response)
  })
})

api.post('/api/board', (req, res) => {
  const boardPost = new Board(req.body)

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

api.put('/api/board', (req, res) => {
  let query = req.body.query
  let update = req.body.update

  Board.findOneAndUpdate(query, update, (error, response) => {
    if (error) return res.json(error)
    return res.json(response)
  })
})

api.put('/api/task/', (req, res) => {
  let query = req.body.query
  let update = req.body.update
  Task.findOneAndUpdate(query, update, (error, response) => {
    if (error) return res.json(error)
    return res.json(response)
  })
})

api.post('/api/task', (req, res) => {
  const taskPost = new Task(req.body)

  taskPost.save((error, response) => {
    if (error) {
      console.error(error)
      return res.json(error)
    }
    return res.json(response)
  })
})

export default api
