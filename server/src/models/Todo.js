const { Schema, model } = require('mongoose')

const todoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    done: { type: Boolean, default: false }
  },
  { timestamps: true },
  { versionKey: false }
)

module.exports = model('Todo', todoSchema)