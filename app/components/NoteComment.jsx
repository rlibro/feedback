import React, { Component, PropTypes } from 'react';

export default class NoteComment extends Component {

  render = () => {

    const { comment } = this.props;

    return <div>{comment.content}</div>
  }
}

NoteComment.propTypes = {
  comment: PropTypes.object.isRequired
}
