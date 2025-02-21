const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  fullName: {
    type: String,
    requird: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
})

module.exports = model('User', userSchema)