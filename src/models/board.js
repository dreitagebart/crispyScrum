import mongoose from 'mongoose'

const schema = mongoose.Schema({
  title: String,
  descr: String,
  attendees: [String]
})

export const Board = mongoose.model('Board', schema)
