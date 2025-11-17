const { Schema, model } = require('mongoose')

const todoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
    description: { type: String, default: '', trim: true, maxlength: 240 },
    done: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret._id = ret._id.toString()
        if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).getTime()
        if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).getTime()
        return ret
      }
    }
  }
)

module.exports = model('Todo', todoSchema)