import mongoose from 'mongoose'

const schema = mongoose.Schema({
  title: String,
  descr: String
})

export const Board = mongoose.model('Board', schema)
