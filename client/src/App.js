import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import Nav from "./components/Nav";
import Home from "./components/Home";
import Post from "./components/Post";
import Footer from "./components/Footer";
import "./App.css";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Nav />
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/post/:id" component={Post} />
            </Switch>
          </BrowserRouter>
          <Footer />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
