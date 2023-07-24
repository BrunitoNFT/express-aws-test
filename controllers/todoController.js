const Todo = require('./../models/todoModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.setTodoUserId = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

exports.ownTodo = catchAsync(async (req, res, next) => {
  let query = Todo.findById(req.params.id).populate('user');
  const doc = await query;
  console.log('doc is: ', doc);
  if (req.user.id == doc.user._id) {
    next();
  } else {
    next(new AppError('You can only edit and delete your own TODOS', 404));
  }
});

exports.getAllTodos = factory.getAll(Todo);
exports.getTodo = factory.getOne(Todo);
exports.createTodo = factory.createOne(Todo);
exports.updateTodo = factory.updateOne(Todo);
exports.deleteTodo = factory.deleteOne(Todo);
