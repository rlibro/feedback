import React, { Component, PropTypes } from 'react';
import moment from 'moment'

export default class NoteComment extends Component {

  render = () => {

    const { comment } = this.props;

    return <div className="NoteComment">
      <div className="profile photo">
        <img src={comment.user.picture.data.url} />
      </div>
      <div className="comment-container">
        <p className="content">
          <span className="name">{comment.user.name}</span>
          <span>{comment.content}</span>
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
