import React, { Component, PropTypes } from 'react';
import moment from 'moment'

export default class NoteComment extends Component {

  render(){

    const { comment } = this.props;

    return <div className="NoteComment">
      <div className="profile photo">
        <img src={comment.author.picture} />
      </div>
      <div className="comment-container">
        <p className="content">
          <span className="name">{comment.author.name}</span>
          <span>{comment.text}</span>
        </p>
        <div className="date">
          { moment(comment.createdAt).fromNow() }
        </div>
      </div>
    </div>
  }
}

NoteComment.propTypes = {
  comment: PropTypes.object.isRequired
}
