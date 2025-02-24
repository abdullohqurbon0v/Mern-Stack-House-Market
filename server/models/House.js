const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HouseSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Owner"
  },
  landmark: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  square: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: false,
  },
  floor: {
    type: Number,
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  numberOfFloorOfTheBuildind: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  repair: {
    type: String,
    required: false,
  },
  userViaOwner: {
    type: String,
    required: false,
  },
  valute: {
    type: String,
    required: true,
  },
  checkConditioner: {
    type: Boolean,
    required: false,
  },
  tv: {
    type: Boolean,
    required: false,
  },
  washingMaching: {
    type: Boolean,
    required: false,
  },
  prepayment: {
    type: Boolean,
    required: false,
  },
  deposit: {
    type: Boolean,
    required: false,
  },
  files: {
    type: [String],
    required: false,
  },
  messageId: {
    type: String,
    required: false,
  },
  id: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('House', HouseSchema);
