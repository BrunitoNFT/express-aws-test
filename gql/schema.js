/* 

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

 */

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    enum Status {
        pending
        done
        cancelled
    }


  type User {
    id: ID
    name: String
    email: String
  }

  # This "Book" type defines the queryable fields for every book in our data source.
  type Todo {
    id: ID
    todo: String
    status: Status
    user: User
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllTodos: [Todo]
    getTodo(id: ID): Todo
  }

  type Mutation {
    createTodo(todo: String, status: Status): Todo
    deleteTodo(id: ID): String
    updateTodo(id: ID, todo: String, status: Status): Todo
  }

`;

module.exports = typeDefs;
