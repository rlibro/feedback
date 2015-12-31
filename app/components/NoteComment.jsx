import React, { Component, PropTypes } from 'react';
import moment from 'moment'

export default class NoteComment extends Component {

  render = () => {

    const { comment } = this.props;

    return <div className="note-comment">
      <img src={comment.user.picture.data.url} /> <span>{comment.user.name}</span>
      <p>{comment.content}</p>
      { moment(comment.createdAt).fromNow() }
    </div>
  }
}

NoteComment.propTypes = {
  comment: PropTypes.object.isRequired
}
