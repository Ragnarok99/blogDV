import React, { Component } from "react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

import Header from "../Header";
import Spinner from "../Spinner";
import PostPreview from "../PostPreview";

const getPosts = gql`
  {
    posts {
      id
      title
    }
  }
`;
class Home extends Component {
  render() {
    const { data } = this.props;

    return (
      <div>
        <Header />

        {data.loading ? (
          <Spinner />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-10 mx-auto">
                {data.posts.map(post => (
                  <PostPreview />
                ))}
                <div className="clearfix">
                  <a className="btn btn-primary float-right" href="#">
                    Older Posts &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default graphql(getPosts)(Home);
