import mongoose from 'mongoose'

const schema = mongoose.Schema({
  type: String,
  title: String,
  descr: String,
  days: Number,
  hours: Number,
  minutes: Number,
  contact: [String],
  sprint: String,
  assignee: String,
  lane: Number,
  board: String
})

export const Task = mongoose.model('Task', schema)
