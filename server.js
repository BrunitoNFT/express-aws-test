const mongoose = require('mongoose');
const express = require('express');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const https = require('https');
const { startStandaloneServer } = require('@apollo/server/standalone');
const fs = require('fs');
const { ApolloServer } = require('@apollo/server');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolvers');
const User = require('./models/userModel');
const {
  ApolloServerPluginDrainHttpServer
} = require('@apollo/server/plugin/drainHttpServer');
const cors = require('cors');
const { json } = require('body-parser');
const { expressMiddleware } = require('@apollo/server/express4');
const key = fs.readFileSync('private.key');
const cert = fs.readFileSync('certificate.crt');

const cred = {
  key,
  cert
};

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const httpsServer = https.createServer(cred, app);
httpsServer.listen(8443);

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

