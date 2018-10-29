import React from "react";
import PropTypes from "prop-types";

const PostPreview = ({ id, title, subTitle, body, author, postedAt }) => {
  return (
    <div className="post-preview">
      <a href="post/12">
        <h2 className="post-title">
          Man must explore, and this is exploration at its greatest
        </h2>
        <h3 className="post-subtitle">
          Problems look mighty small from 150 miles up
        </h3>
      </a>
      <p className="post-meta">
        Posted by
        <a href="#">Start Bootstrap</a>
        on September 24, 2018
      </p>
      <hr />
    </div>
  );
};

PostPreview.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  body: PropTypes.string,
  author: PropTypes.string,
  postedAt: PropTypes.string
};

export default PostPreview;
