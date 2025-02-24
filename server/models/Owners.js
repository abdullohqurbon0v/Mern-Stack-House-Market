const { Schema, model } = require('mongoose')

const ownerSchema = new Schema({
      id: {
            type: Number,
            required: true
      },
      name: {
            type: String,
            required: true
      },
      phone: {
            type: String,
            required: true
      }
}, {
      timestamps: true
})

module.exports = model('Owner', ownerSchema)