const express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");
const app = express();
const mongoose = require("mongoose");

app.use(cors());
const PORT = process.env.PORT || 4000;
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

mongoose
  .connect(
    "mongodb://admin:test123@ds155292.mlab.com:55292/dvblog",
    options
  )
  .then(() => {
    console.log("connected to mongo database");
  });
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema
  })
);
app.listen(PORT, () => {
  console.log(`server running on: ${PORT}`);
});
