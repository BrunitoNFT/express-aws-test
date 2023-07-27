const { GraphQLError } = require('graphql');
const Todo = require('../models/todoModel');

const resolvers = {
  Query: {
    getAllTodos: async () => {
      const todos = await Todo.find().populate('user');
      return todos;
    },
    async getTodo(_, { id }) {
      return await Todo.findById(id).populate('user');
    }
  },
  Mutation: {
    async createTodo(parent, { todo, status }, context) {
      if (context.currentUser && context.currentUser.name.length > 0) {
        const newTodo = new Todo({
          todo,
          status,
          user: context.currentUser.id
        });
        await newTodo.save();
        return newTodo;
      }
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 }
        }
      });
    },
    async deleteTodo(_, { id }, context) {
      if (context.currentUser && context.currentUser.name.length > 0) {
        await Todo.findByIdAndDelete(id);
        return 'Todo Deleted';
      }
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 }
        }
      });
    },
    async updateTodo(_, { id, todo, status }) {
      const newTodo = await Todo.findByIdAndUpdate(
        id,
        {
          $set: {
            todo,
            status
          }
        },
        {
          new: true
        }
      );
      return newTodo;
    }
  }
};

module.exports = resolvers;
