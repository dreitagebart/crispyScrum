import mongoose from 'mongoose'

const schema = mongoose.Schema({
  mail: String,
  user: String,
  first: String,
  last: String,
  descr: String,
  interests: String,
  isAdmin: Boolean,
  born: { type: Date }
})

export const User = mongoose.model('User', schema)
