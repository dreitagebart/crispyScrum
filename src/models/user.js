import mongoose from 'mongoose'

const schema = mongoose.Schema({
  board: String,
  mail: String,
  user: String,
  first: String,
  last: String,
  descr: String,
  interests: String,
  isAdmin: Boolean,
  born: { type: Date },
  avatar: String
})

export const User = mongoose.model('User', schema)
