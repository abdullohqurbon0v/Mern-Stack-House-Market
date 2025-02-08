const { Schema, model } = require('mongoose')

const houseSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  rayon: {
    type: String,
    requierd: true
  },
  address: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    required: true
  },
  informations: [{
    key: String,
    value: String,
  }],

  prepayment: {
    type: Boolean,
    required: true
  },
  depozit: {
    type: Boolean,
    required: true
  },
  messageId: {
    type: Number,
    required: true,
    unique: true
  },
  price: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})


module.exports = model('House', houseSchema)