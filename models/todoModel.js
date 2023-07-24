const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    todo: {
      type: String,
      require: [true, 'A text in the todo is required!'],
      minLength: [3, 'At least a text with 3 characters is required!'],
      maxLength: [500, 'The maximum quantity of length in this text is of 500!']
    },
    status: {
      type: String,
      enum: ['pending', 'done', 'cancelled'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
