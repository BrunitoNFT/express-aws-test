const express = require('express');
const todoController = require('./../controllers/todoController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(todoController.getAllTodos)
  .post(
    authController.protect,
    todoController.setTodoUserId,
    todoController.createTodo
  );

router
  .route('/:id')
  .get(todoController.getTodo)
  .patch(
    authController.protect,
    todoController.ownTodo,
    todoController.updateTodo
  )
  .delete(
    authController.protect,
    todoController.ownTodo,
    todoController.deleteTodo
  );

module.exports = router;
