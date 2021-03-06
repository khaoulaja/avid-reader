const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {typeDefs, resolvers} = require('./schemas')
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async ()=> {
  //create new apollo server and pass in our schema
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });

  //start Apollo server
  await server.start();
  //integrate apollo sessrver with express as middleware
  server.applyMiddleware({ app });

  console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`);
}

startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}



db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
