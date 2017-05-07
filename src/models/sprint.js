import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String,
  end: { type: Date },
  board: String,
  status: Number
})

export const Sprint = mongoose.model('Sprint', schema)
