import React, { Component, PropTypes } from 'react';

export default class NoteCommentForm extends Component {

  render = () => {
    return <div>
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="댓글을 입력하세요." 
          autoFocus={true}
          onKeyPress={this.checkEnter} />
        <input type="submit" value="SEND" />
      </form>
    </div>
  }

  handleSubmit = (e) => {
    e.preventDefault()
  }

  checkEnter = (e) => {
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  }

  finishEdit = (e) => {
    this.props.onSubmitComment(e.target.value);

    e.target.value = '';
  }
}

NoteCommentForm.propTypes = {
  isOpenComment: PropTypes.bool.isRequired,
  onSubmitComment: PropTypes.func.isRequired
}