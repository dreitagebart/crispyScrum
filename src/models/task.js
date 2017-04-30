import mongoose from 'mongoose'

const schema = mongoose.Schema({
  type: String,
  title: String,
  descr: String,
  days: Number,
  hours: Number,
  minutes: Number
})

export const Task = mongoose.model('Task', schema)
