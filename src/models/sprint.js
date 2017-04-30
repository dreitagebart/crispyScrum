import mongoose from 'mongoose'

const schema = mongoose.Schema({
  name: String
})

export const Sprint = mongoose.model('Sprint', schema)
