const jwt = require('jsonwebtoken');
const { expressMiddleware } = require('@apollo/server/express4');
const { promisify } = require('util');
const { ApolloServer } = require('@apollo/server');
const User = require('../models/userModel');

const typeDefs = require('../gql/schema');
const resolvers = require('../gql/resolvers');

const serverGQL = new ApolloServer({
  typeDefs,
  resolvers
});

const graphqlServer = async appFunc => {
  await serverGQL.start();

  appFunc.use(
    '/graphql',
    expressMiddleware(serverGQL, {
      context: async ({ req, res }) => {
        console.log('JWT: ', req.headers.authorization);

        // Obtén el cuerpo de la solicitud
        const requestBody = req.body;
        console.log('body: ', requestBody);

        // Verifica si el campo 'query' está presente en el cuerpo de la solicitud
        if (requestBody && requestBody.query) {
          // Verifica si se trata de una consulta (query) o una mutación (mutation)
          const isQuery = requestBody.query.trim().startsWith('query');
          const isMutation = requestBody.query.trim().startsWith('mutation');

          if (isQuery) {
            // Es una consulta (query)
            console.log(
              'Se está realizando una consulta GraphQL:',
              requestBody.query
            );
          } else if (isMutation) {
            // Es una mutación (mutation)
            console.log(
              'Se está realizando una mutación GraphQL:',
              requestBody.query
            );
            // verificar usuario con JWT

            let token;
            console.log('token test');
            if (
              req.headers.authorization &&
              req.headers.authorization.startsWith('Bearer')
            ) {
              token = req.headers.authorization.split(' ')[1];
              console.log('token is: ', token);
            }

            if (!token) {
              return null;
            }

            // 2) Verification token
            const decoded = await promisify(jwt.verify)(
              token,
              process.env.JWT_SECRET
            );

            // 3) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
              return null;
            }

            // 4) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
              return null;
            }
            console.log('final user before: ', currentUser);
            // GRANT ACCESS TO PROTECTED ROUTE
            return { currentUser };
          } else {
            console.log('La solicitud no contiene una consulta válida.');
            return null;
          }
        } else {
          console.log(
            'La solicitud no contiene un cuerpo válido o una consulta GraphQL.'
          );
          return null;
        }
      }
    })
  );
};

module.exports = graphqlServer;
